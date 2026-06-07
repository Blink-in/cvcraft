const crypto = require('crypto')
const { connectDB } = require('./_lib/mongoose')
const Entitlement = require('./_lib/models/Entitlement')

const PRICE_CENTS = Number(process.env.PAYMENT_PRICE_CENTS || process.env.LEMON_SQUEEZY_PRICE_CENTS || 250)
const PRICE_AMOUNT = Number((PRICE_CENTS / 100).toFixed(2))
const DEFAULT_CURRENCY = process.env.PAYMENT_CURRENCY || process.env.LEMON_SQUEEZY_CURRENCY || 'USD'
const ENABLED_PROVIDERS = String(process.env.PAYMENT_PROVIDERS || 'paystack,flutterwave')
  .split(',')
  .map(provider => provider.trim().toLowerCase())
  .filter(Boolean)

async function handler(req, res) {
  const action = req.query.action

  try {
    if (req.method === 'GET' && action === 'status') {
      await connectDB()
      const { sessionId, cvId } = req.query
      if (!sessionId || !cvId) return res.status(400).json({ error: 'sessionId and cvId are required' })

      await verifyReturnedPayment(req.query)

      const entitlements = await Entitlement.find({ sessionId, cvId, active: true }).sort({ createdAt: -1 }).lean()
      return res.status(200).json({
        downloadUnlocked: entitlements.some(e => e.type === 'download'),
        editUnlocked: entitlements.some(e => e.type === 'edit'),
        entitlements,
      })
    }

    if (req.method === 'POST' && action === 'checkout') {
      const body = await readJson(req)
      const { sessionId, cvId, cvTitle, unlockType = 'download', redirectUrl, provider = 'paystack', customerEmail } = body || {}
      if (!sessionId || !cvId) return res.status(400).json({ error: 'sessionId and cvId are required' })

      const normalizedProvider = normalizeProvider(provider)
      assertProviderEnabled(normalizedProvider)

      const checkoutUrl = await createCheckout({
        provider: normalizedProvider,
        sessionId,
        cvId,
        cvTitle,
        unlockType,
        redirectUrl,
        customerEmail,
        origin: getOrigin(req),
      })

      return res.status(200).json({ checkoutUrl, provider: normalizedProvider })
    }

    if (req.method === 'POST' && action === 'ad-unlock') {
      await connectDB()
      const body = await readJson(req)
      const { sessionId, cvId, unlockType = 'download' } = body || {}
      if (!sessionId || !cvId) return res.status(400).json({ error: 'sessionId and cvId are required' })

      await upsertEntitlement({
        sessionId,
        cvId,
        type: normalizeUnlockType(unlockType),
        source: 'rewarded_ad',
        metadata: { awardedAt: new Date().toISOString() },
      })

      return res.status(200).json({ ok: true })
    }

    if (req.method === 'POST' && action === 'webhook') {
      const rawBody = await readRawBody(req)
      const provider = normalizeProvider(req.query.provider || req.headers['x-cvcraft-provider'] || detectWebhookProvider(req))
      assertProviderEnabled(provider)

      if (provider === 'paystack') await handlePaystackWebhook(req, rawBody)
      else if (provider === 'flutterwave') await handleFlutterwaveWebhook(req, rawBody)
      else if (provider === 'lemon_squeezy') await handleLemonWebhook(req, rawBody)

      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    const status = err.statusCode || 500
    return res.status(status).json({ error: err.message })
  }
}

handler.config = {
  api: {
    bodyParser: false,
  },
}

module.exports = handler
module.exports.config = handler.config

async function createCheckout(options) {
  if (options.provider === 'paystack') return createPaystackCheckout(options)
  if (options.provider === 'flutterwave') return createFlutterwaveCheckout(options)
  if (options.provider === 'lemon_squeezy') return createLemonCheckout(options)
  const err = new Error('Unsupported payment provider')
  err.statusCode = 400
  throw err
}

async function createPaystackCheckout({ sessionId, cvId, cvTitle, unlockType, redirectUrl, customerEmail, origin }) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    const err = new Error('Paystack env var is missing: PAYSTACK_SECRET_KEY')
    err.statusCode = 501
    throw err
  }

  const url = addPaymentParams(redirectUrl || `${origin}/cv/${encodeURIComponent(cvId)}`, 'paystack')
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: normalizeEmail(customerEmail, sessionId),
      amount: PRICE_CENTS,
      currency: DEFAULT_CURRENCY,
      callback_url: url,
      metadata: {
        sessionId,
        cvId,
        unlockType: normalizeUnlockType(unlockType),
        cvTitle: cvTitle || 'Untitled CV',
      },
    }),
  })

  const json = await response.json()
  if (!response.ok || !json.status) throwProviderError(json, response.status, 'Unable to create Paystack checkout')
  return json?.data?.authorization_url
}

async function createFlutterwaveCheckout({ sessionId, cvId, cvTitle, unlockType, redirectUrl, customerEmail, origin }) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) {
    const err = new Error('Flutterwave env var is missing: FLUTTERWAVE_SECRET_KEY')
    err.statusCode = 501
    throw err
  }

  const txRef = `cvcraft-${cvId}-${Date.now()}`
  const url = addPaymentParams(redirectUrl || `${origin}/cv/${encodeURIComponent(cvId)}`, 'flutterwave')
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: PRICE_AMOUNT,
      currency: DEFAULT_CURRENCY,
      redirect_url: url,
      customer: {
        email: normalizeEmail(customerEmail, sessionId),
        name: 'CVCraft Customer',
      },
      customizations: {
        title: normalizeUnlockType(unlockType) === 'edit' ? 'CV Edit Unlock' : 'CV Download',
        description: `${normalizeUnlockType(unlockType) === 'edit' ? 'Edit' : 'Download'} ${cvTitle || 'your CV'} in any available format.`,
      },
      meta: {
        sessionId,
        cvId,
        unlockType: normalizeUnlockType(unlockType),
      },
    }),
  })

  const json = await response.json()
  if (!response.ok || json.status !== 'success') throwProviderError(json, response.status, 'Unable to create Flutterwave checkout')
  return json?.data?.link
}

async function createLemonCheckout({ sessionId, cvId, cvTitle, unlockType, redirectUrl, origin }) {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID
  const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID

  if (!apiKey || !storeId || !variantId) {
    const err = new Error('Lemon Squeezy env vars are missing: LEMON_SQUEEZY_API_KEY, LEMON_SQUEEZY_STORE_ID, LEMON_SQUEEZY_VARIANT_ID')
    err.statusCode = 501
    throw err
  }

  const url = addPaymentParams(redirectUrl || `${origin}/cv/${encodeURIComponent(cvId)}`, 'lemon_squeezy')
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              sessionId,
              cvId,
              unlockType: normalizeUnlockType(unlockType),
            },
          },
          product_options: {
            name: normalizeUnlockType(unlockType) === 'edit' ? 'CV Edit Unlock' : 'CV Download',
            description: `${normalizeUnlockType(unlockType) === 'edit' ? 'Edit' : 'Download'} ${cvTitle || 'your CV'} in any available format.`,
            redirect_url: url,
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: String(storeId) } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    }),
  })

  const json = await response.json()
  if (!response.ok) {
    const message = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'Unable to create Lemon Squeezy checkout'
    const err = new Error(message)
    err.statusCode = response.status
    throw err
  }

  return json?.data?.attributes?.url
}

async function verifyReturnedPayment(query) {
  const provider = normalizeProvider(query.provider || query.paymentProvider || '')
  if (!provider) return

  if (provider === 'paystack' && query.reference) {
    const payment = await verifyPaystackReference(query.reference)
    if (payment?.status === 'success') await awardPaymentEntitlements(fromPaystackPayment(payment))
  }

  if (provider === 'flutterwave' && (query.transaction_id || query.tx_ref)) {
    const payment = query.transaction_id
      ? await verifyFlutterwaveTransaction(query.transaction_id)
      : await verifyFlutterwaveTxRef(query.tx_ref)
    if (payment?.status === 'successful') await awardPaymentEntitlements(fromFlutterwavePayment(payment))
  }
}

async function handlePaystackWebhook(req, rawBody) {
  verifyPaystackWebhook(req, rawBody)
  const payload = JSON.parse(rawBody.toString('utf8'))
  if (payload?.event !== 'charge.success') return
  await connectDB()
  await awardPaymentEntitlements(fromPaystackPayment(payload.data))
}

async function handleFlutterwaveWebhook(req, rawBody) {
  verifyFlutterwaveWebhook(req)
  const payload = JSON.parse(rawBody.toString('utf8'))
  const data = payload?.data || payload
  if (!['successful', 'completed'].includes(data?.status)) return
  await connectDB()
  await awardPaymentEntitlements(fromFlutterwavePayment(data))
}

async function handleLemonWebhook(req, rawBody) {
  verifyLemonWebhook(req, rawBody)
  const payload = JSON.parse(rawBody.toString('utf8'))
  const event = payload?.meta?.event_name
  if (!['order_created', 'subscription_payment_success'].includes(event)) return

  const custom = payload?.meta?.custom_data || payload?.data?.attributes?.custom_data || {}
  await connectDB()
  await awardPaymentEntitlements({
    provider: 'lemon_squeezy',
    sessionId: custom.sessionId,
    cvId: custom.cvId,
    unlockType: custom.unlockType,
    orderId: String(payload?.data?.id || ''),
    checkoutId: String(payload?.data?.attributes?.checkout_id || ''),
    customerEmail: payload?.data?.attributes?.user_email || payload?.data?.attributes?.customer_email || null,
    amount: payload?.data?.attributes?.total || PRICE_CENTS,
    currency: payload?.data?.attributes?.currency || DEFAULT_CURRENCY,
    metadata: payload?.data?.attributes || {},
  })
}

async function awardPaymentEntitlements(payment) {
  if (!payment?.sessionId || !payment?.cvId) return
  const unlockType = normalizeUnlockType(payment.unlockType)

  await upsertEntitlement({
    sessionId: payment.sessionId,
    cvId: payment.cvId,
    type: unlockType,
    source: payment.provider,
    orderId: payment.orderId,
    checkoutId: payment.checkoutId,
    customerEmail: payment.customerEmail,
    amount: payment.amount,
    currency: payment.currency,
    metadata: payment.metadata,
  })

  if (unlockType === 'edit') return
  await upsertEntitlement({
    sessionId: payment.sessionId,
    cvId: payment.cvId,
    type: 'edit',
    source: payment.provider,
    orderId: `${payment.orderId || payment.checkoutId || payment.cvId}:edit`,
    checkoutId: payment.checkoutId,
    customerEmail: payment.customerEmail,
    amount: payment.amount,
    currency: payment.currency,
    metadata: payment.metadata,
  })
}

function fromPaystackPayment(data) {
  const metadata = data?.metadata || {}
  return {
    provider: 'paystack',
    sessionId: metadata.sessionId,
    cvId: metadata.cvId,
    unlockType: metadata.unlockType,
    orderId: String(data?.reference || ''),
    checkoutId: String(data?.id || data?.reference || ''),
    customerEmail: data?.customer?.email || null,
    amount: data?.amount || PRICE_CENTS,
    currency: data?.currency || DEFAULT_CURRENCY,
    metadata: data || {},
    status: data?.status,
  }
}

function fromFlutterwavePayment(data) {
  const metadata = data?.meta || data?.metadata || {}
  return {
    provider: 'flutterwave',
    sessionId: metadata.sessionId,
    cvId: metadata.cvId,
    unlockType: metadata.unlockType,
    orderId: String(data?.tx_ref || data?.flw_ref || ''),
    checkoutId: String(data?.id || data?.transaction_id || ''),
    customerEmail: data?.customer?.email || null,
    amount: Math.round(Number(data?.amount || PRICE_AMOUNT) * 100),
    currency: data?.currency || DEFAULT_CURRENCY,
    metadata: data || {},
    status: data?.status,
  }
}

async function verifyPaystackReference(reference) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return null

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const json = await response.json()
  if (!response.ok || !json.status) return null
  return json.data
}

async function verifyFlutterwaveTransaction(transactionId) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) return null

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const json = await response.json()
  if (!response.ok || json.status !== 'success') return null
  return json.data
}

async function verifyFlutterwaveTxRef(txRef) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) return null

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const json = await response.json()
  if (!response.ok || json.status !== 'success') return null
  return json.data
}

function verifyPaystackWebhook(req, rawBody) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return

  const signature = req.headers['x-paystack-signature']
  const digest = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  if (!safeCompare(signature, digest)) {
    const err = new Error('Invalid Paystack webhook signature')
    err.statusCode = 401
    throw err
  }
}

function verifyFlutterwaveWebhook(req) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH
  if (!secretHash) return

  const signature = req.headers['verif-hash']
  if (!safeCompare(signature, secretHash)) {
    const err = new Error('Invalid Flutterwave webhook signature')
    err.statusCode = 401
    throw err
  }
}

function verifyLemonWebhook(req, rawBody) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) return

  const signature = req.headers['x-signature']
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (!safeCompare(signature, digest)) {
    const err = new Error('Invalid Lemon Squeezy webhook signature')
    err.statusCode = 401
    throw err
  }
}

async function upsertEntitlement(data) {
  const query = data.orderId
    ? { orderId: data.orderId, cvId: data.cvId, type: data.type }
    : { sessionId: data.sessionId, cvId: data.cvId, type: data.type, source: data.source }

  return Entitlement.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true })
}

function addPaymentParams(url, provider) {
  const paymentUrl = new URL(url)
  paymentUrl.searchParams.set('payment', 'success')
  paymentUrl.searchParams.set('provider', provider)
  return paymentUrl.toString()
}

function assertProviderEnabled(provider) {
  if (ENABLED_PROVIDERS.includes(provider)) return
  const err = new Error(`${provider || 'This payment provider'} is not enabled`)
  err.statusCode = 403
  throw err
}

function normalizeProvider(provider) {
  const value = String(provider || '').trim().toLowerCase().replace(/-/g, '_')
  if (value === 'lemon' || value === 'lemonsqueezy') return 'lemon_squeezy'
  if (value === 'flutter_wave') return 'flutterwave'
  return value
}

function normalizeUnlockType(unlockType) {
  return unlockType === 'edit' ? 'edit' : 'download'
}

function normalizeEmail(email, sessionId) {
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return email
  return `customer-${String(sessionId).replace(/[^a-z0-9]/gi, '').slice(0, 32)}@cvcraft.local`
}

function detectWebhookProvider(req) {
  if (req.headers['x-paystack-signature']) return 'paystack'
  if (req.headers['verif-hash']) return 'flutterwave'
  if (req.headers['x-signature']) return 'lemon_squeezy'
  return ''
}

function throwProviderError(json, status, fallback) {
  const err = new Error(json?.message || json?.errors?.[0]?.detail || json?.errors?.[0]?.title || fallback)
  err.statusCode = status || 502
  throw err
}

function safeCompare(received, expected) {
  if (!received || !expected) return false
  const a = Buffer.from(String(received), 'utf8')
  const b = Buffer.from(String(expected), 'utf8')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function getOrigin(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${protocol}://${host}`
}

async function readJson(req) {
  const raw = await readRawBody(req)
  if (!raw.length) return {}
  return JSON.parse(raw.toString('utf8'))
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
