const crypto = require('crypto')
const { connectDB } = require('./_lib/mongoose')
const Entitlement = require('./_lib/models/Entitlement')
const PaymentAttempt = require('./_lib/models/PaymentAttempt')

const PAYSTACK_NGN_RATE = Number(process.env.PAYSTACK_NGN_RATE || 1300)
const PRICE_CENTS = Number(process.env.PAYMENT_PRICE_CENTS || process.env.LEMON_SQUEEZY_PRICE_CENTS || 250)
const PRICE_AMOUNT = Number((PRICE_CENTS / 100).toFixed(2))

// Provider-specific currencies for better compatibility
const PROVIDER_CURRENCIES = {
  paystack: String(process.env.PAYSTACK_CURRENCY || process.env.PAYMENT_CURRENCY || 'NGN').toUpperCase(),
  flutterwave: String(process.env.FLUTTERWAVE_CURRENCY || 'USD').toUpperCase(),
  lemon_squeezy: String(process.env.LEMON_SQUEEZY_CURRENCY || 'USD').toUpperCase(),
}
const DEFAULT_CURRENCY = String(process.env.PAYMENT_CURRENCY || PROVIDER_CURRENCIES.flutterwave).toUpperCase()

const CHECKOUT_TTL_MINUTES = Number(process.env.PAYMENT_CHECKOUT_TTL_MINUTES || 30)
const ENABLED_PROVIDERS = String(process.env.PAYMENT_PROVIDERS || 'paystack,flutterwave')
  .split(',')
  .map(provider => normalizeProvider(provider))
  .filter(Boolean)

function getCurrencyForProvider(provider) {
  return PROVIDER_CURRENCIES[provider] || DEFAULT_CURRENCY
}

async function handler(req, res) {
  const action = req.query.action

  try {
    if (req.method === 'GET' && action === 'status') {
      await connectDB()
      const { sessionId, cvId } = req.query
      if (!sessionId || !cvId) return res.status(400).json({ error: 'sessionId and cvId are required' })

      await verifyReturnedPayment(req.query, { sessionId, cvId })
      await verifyPendingAttempts({ sessionId, cvId })

      const entitlements = await Entitlement.find({ sessionId, cvId, active: true }).sort({ createdAt: -1 }).lean()
      return res.status(200).json({
        downloadUnlocked: entitlements.some(e => e.type === 'download'),
        editUnlocked: entitlements.some(e => e.type === 'edit'),
        entitlements,
      })
    }

    if (req.method === 'POST' && action === 'checkout') {
      await connectDB()
      const body = await readJson(req)
      const { sessionId, cvId, cvTitle, unlockType = 'download', redirectUrl, provider = 'paystack', customerEmail } = body || {}
      if (!sessionId || !cvId) return res.status(400).json({ error: 'sessionId and cvId are required' })
      if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        return res.status(400).json({ error: 'A valid email address is required for payment' })
      }

      const normalizedProvider = normalizeProvider(provider)
      const normalizedUnlockType = normalizeUnlockType(unlockType)
      assertProviderEnabled(normalizedProvider)

      if (await hasActiveEntitlement(sessionId, cvId, normalizedUnlockType)) {
        return res.status(200).json({
          alreadyUnlocked: true,
          provider: normalizedProvider,
          checkoutUrl: safeReturnUrl(redirectUrl, getOrigin(req), cvId),
        })
      }

      const reusableAttempt = await findReusableAttempt({ provider: normalizedProvider, sessionId, cvId, unlockType: normalizedUnlockType })
      if (reusableAttempt?.checkoutUrl) {
        return res.status(200).json({ checkoutUrl: reusableAttempt.checkoutUrl, provider: reusableAttempt.provider, reference: reusableAttempt.reference })
      }

      const checkout = await createCheckout({
        provider: normalizedProvider,
        sessionId,
        cvId,
        cvTitle,
        unlockType: normalizedUnlockType,
        redirectUrl,
        customerEmail,
        origin: getOrigin(req),
      })

      return res.status(200).json(checkout)
    }

    if (req.method === 'POST' && action === 'ad-unlock') {
      if (process.env.REWARDED_AD_UNLOCKS_ENABLED !== 'true') {
        const err = new Error('Rewarded ad unlocks are disabled until a server-verifiable ad provider is configured')
        err.statusCode = 501
        throw err
      }

      const err = new Error('Rewarded ad unlocks need server-side reward verification before access can be granted')
      err.statusCode = 501
      throw err
    }

    if (req.method === 'POST' && action === 'webhook') {
      await connectDB()
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

  const reference = createReference('ps')
  const currency = getCurrencyForProvider('paystack')
  const amount = currency === 'NGN' ? Math.round(PRICE_CENTS / 100 * PAYSTACK_NGN_RATE * 100) : PRICE_CENTS
  const attempt = await createPaymentAttempt({
    provider: 'paystack',
    reference,
    sessionId,
    cvId,
    unlockType,
    customerEmail,
    currency,
    amount,
  })

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: normalizeEmail(customerEmail, sessionId),
      amount,
      currency,
      reference,
      callback_url: addPaymentParams(safeReturnUrl(redirectUrl, origin, cvId), 'paystack'),
      metadata: {
        attemptId: String(attempt._id),
        reference,
        sessionId,
        cvId,
        unlockType,
        cvTitle: cvTitle || 'Untitled CV',
      },
    }),
  })

  const json = await response.json()
  if (!response.ok || !json.status || !json?.data?.authorization_url) {
    await markAttemptFailed(reference, json)
    throwProviderError(json, response.status, 'Unable to create Paystack checkout')
  }

  await PaymentAttempt.updateOne({ reference }, { $set: { checkoutUrl: json.data.authorization_url, metadata: { initialize: json.data } } })
  return { checkoutUrl: json.data.authorization_url, provider: 'paystack', reference }
}

async function createFlutterwaveCheckout({ sessionId, cvId, cvTitle, unlockType, redirectUrl, customerEmail, origin }) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey) {
    const err = new Error('Flutterwave env var is missing: FLUTTERWAVE_SECRET_KEY')
    err.statusCode = 501
    throw err
  }

  const reference = createReference('flw')
  const currency = getCurrencyForProvider('flutterwave')
  await createPaymentAttempt({
    provider: 'flutterwave',
    reference,
    sessionId,
    cvId,
    unlockType,
    customerEmail,
    currency,
  })

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount: PRICE_AMOUNT,
      currency,
      redirect_url: addPaymentParams(safeReturnUrl(redirectUrl, origin, cvId), 'flutterwave'),
      customer: {
        email: normalizeEmail(customerEmail, sessionId),
        name: 'CVCraft Customer',
      },
      customizations: {
        title: unlockType === 'edit' ? 'CV Edit Unlock' : 'CV Download',
        description: `${unlockType === 'edit' ? 'Edit' : 'Download'} ${cvTitle || 'your CV'} in any available format.`,
      },
      meta: {
        reference,
        sessionId,
        cvId,
        unlockType,
      },
    }),
  })

  const json = await response.json()
  if (!response.ok || json.status !== 'success' || !json?.data?.link) {
    await markAttemptFailed(reference, json)
    throwProviderError(json, response.status, 'Unable to create Flutterwave checkout')
  }

  await PaymentAttempt.updateOne({ reference }, { $set: { checkoutUrl: json.data.link, metadata: { initialize: json.data } } })
  return { checkoutUrl: json.data.link, provider: 'flutterwave', reference }
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

  const reference = createReference('ls')
  await createPaymentAttempt({ provider: 'lemon_squeezy', reference, sessionId, cvId, unlockType })

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
            custom: { reference, sessionId, cvId, unlockType },
          },
          product_options: {
            name: unlockType === 'edit' ? 'CV Edit Unlock' : 'CV Download',
            description: `${unlockType === 'edit' ? 'Edit' : 'Download'} ${cvTitle || 'your CV'} in any available format.`,
            redirect_url: addPaymentParams(safeReturnUrl(redirectUrl, origin, cvId), 'lemon_squeezy'),
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
  if (!response.ok || !json?.data?.attributes?.url) {
    await markAttemptFailed(reference, json)
    const message = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'Unable to create Lemon Squeezy checkout'
    const err = new Error(message)
    err.statusCode = response.status
    throw err
  }

  const checkoutUrl = json.data.attributes.url
  await PaymentAttempt.updateOne({ reference }, { $set: { checkoutUrl, metadata: { initialize: json.data } } })
  return { checkoutUrl, provider: 'lemon_squeezy', reference }
}

async function verifyReturnedPayment(query, expected) {
  const provider = normalizeProvider(query.provider || query.paymentProvider || '')
  if (!provider) return

  if (provider === 'paystack' && query.reference) {
    await verifyAndAwardPaystack(query.reference, expected)
  }

  if (provider === 'flutterwave' && (query.transaction_id || query.tx_ref)) {
    await verifyAndAwardFlutterwave({ transactionId: query.transaction_id, reference: query.tx_ref }, expected)
  }
}

async function verifyPendingAttempts({ sessionId, cvId }) {
  const attempts = await PaymentAttempt.find({
    sessionId,
    cvId,
    status: 'pending',
    expiresAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).sort({ createdAt: -1 }).limit(5).lean()

  for (const attempt of attempts) {
    if (attempt.provider === 'paystack') await verifyAndAwardPaystack(attempt.reference, { sessionId, cvId })
    if (attempt.provider === 'flutterwave') await verifyAndAwardFlutterwave({ reference: attempt.reference }, { sessionId, cvId })
  }
}

async function handlePaystackWebhook(req, rawBody) {
  verifyPaystackWebhook(req, rawBody)
  const payload = JSON.parse(rawBody.toString('utf8'))
  if (!['charge.success', 'transaction.success'].includes(payload?.event)) return
  const reference = payload?.data?.reference
  if (reference) await verifyAndAwardPaystack(reference)
}

async function handleFlutterwaveWebhook(req, rawBody) {
  verifyFlutterwaveWebhook(req, rawBody)
  const payload = JSON.parse(rawBody.toString('utf8'))
  const data = payload?.data || payload
  if (!['successful', 'completed'].includes(data?.status)) return
  await verifyAndAwardFlutterwave({ transactionId: data?.id || data?.transaction_id, reference: data?.tx_ref })
}

async function handleLemonWebhook(req, rawBody) {
  verifyLemonWebhook(req, rawBody)
  const payload = JSON.parse(rawBody.toString('utf8'))
  const event = payload?.meta?.event_name
  if (!['order_created', 'subscription_payment_success'].includes(event)) return

  const custom = payload?.meta?.custom_data || payload?.data?.attributes?.custom_data || {}
  const reference = custom.reference
  const attempt = reference ? await PaymentAttempt.findOne({ reference }) : null
  if (!attempt) return

  await finalizeVerifiedPayment(attempt, {
    provider: 'lemon_squeezy',
    reference,
    status: 'success',
    sessionId: attempt.sessionId,
    cvId: attempt.cvId,
    unlockType: attempt.unlockType,
    orderId: String(payload?.data?.id || reference),
    checkoutId: String(payload?.data?.attributes?.checkout_id || reference),
    customerEmail: payload?.data?.attributes?.user_email || payload?.data?.attributes?.customer_email || null,
    amount: payload?.data?.attributes?.total || attempt.amount,
    currency: payload?.data?.attributes?.currency || attempt.currency,
    metadata: payload?.data?.attributes || {},
  })
}

async function verifyAndAwardPaystack(reference, expected) {
  const payment = await verifyPaystackReference(reference)
  if (!payment) return null
  return finalizeVerifiedPaymentByReference('paystack', reference, fromPaystackPayment(payment), expected)
}

async function verifyAndAwardFlutterwave({ transactionId, reference }, expected) {
  const payment = transactionId
    ? await verifyFlutterwaveTransaction(transactionId)
    : await verifyFlutterwaveTxRef(reference)
  if (!payment) return null
  return finalizeVerifiedPaymentByReference('flutterwave', payment.tx_ref || reference, fromFlutterwavePayment(payment), expected)
}

async function finalizeVerifiedPaymentByReference(provider, reference, payment, expected) {
  if (!reference) return null

  const attempt = await PaymentAttempt.findOne({ provider, reference })
  if (!attempt) return null
  if (attempt.status === 'success') return attempt
  if (attempt.status !== 'pending') return null

  if (expected && (attempt.sessionId !== expected.sessionId || attempt.cvId !== expected.cvId)) {
    return null
  }

  return finalizeVerifiedPayment(attempt, payment)
}

async function finalizeVerifiedPayment(attempt, payment) {
  const validationError = validatePaymentAgainstAttempt(attempt, payment)
  if (validationError) {
    await PaymentAttempt.updateOne(
      { _id: attempt._id, status: 'pending' },
      { $set: { status: 'failed', verifiedAt: new Date(), metadata: { ...(attempt.metadata || {}), validationError, payment: payment.metadata } } }
    )
    return null
  }

  const updatedAttempt = await PaymentAttempt.findOneAndUpdate(
    { _id: attempt._id, status: 'pending' },
    {
      $set: {
        status: 'success',
        providerTransactionId: payment.checkoutId,
        customerEmail: payment.customerEmail || attempt.customerEmail,
        verifiedAt: new Date(),
        metadata: { ...(attempt.metadata || {}), verifiedPayment: payment.metadata },
      },
    },
    { new: true }
  )

  if (!updatedAttempt && attempt.status !== 'success') return null

  await awardPaymentEntitlements({
    provider: attempt.provider,
    sessionId: attempt.sessionId,
    cvId: attempt.cvId,
    unlockType: attempt.unlockType,
    orderId: payment.orderId || attempt.reference,
    checkoutId: payment.checkoutId || attempt.reference,
    customerEmail: payment.customerEmail || attempt.customerEmail,
    amount: attempt.amount,
    currency: attempt.currency,
    metadata: payment.metadata || {},
  })

  return updatedAttempt || attempt
}

function validatePaymentAgainstAttempt(attempt, payment) {
  if (!['success', 'successful'].includes(payment.status)) return 'payment_not_successful'
  if (payment.provider !== attempt.provider) return 'provider_mismatch'
  if (payment.reference && payment.reference !== attempt.reference) return 'reference_mismatch'
  if (payment.sessionId && payment.sessionId !== attempt.sessionId) return 'session_mismatch'
  if (payment.cvId && payment.cvId !== attempt.cvId) return 'cv_mismatch'
  if (normalizeUnlockType(payment.unlockType) !== attempt.unlockType) return 'unlock_type_mismatch'
  if (Number(payment.amount) !== Number(attempt.amount)) return 'amount_mismatch'
  if (String(payment.currency || '').toUpperCase() !== attempt.currency) return 'currency_mismatch'
  if (attempt.expiresAt < new Date()) return 'checkout_expired'
  return ''
}

async function awardPaymentEntitlements(payment) {
  await upsertEntitlement({
    sessionId: payment.sessionId,
    cvId: payment.cvId,
    type: payment.unlockType,
    source: payment.provider,
    orderId: payment.orderId,
    checkoutId: payment.checkoutId,
    customerEmail: payment.customerEmail,
    amount: payment.amount,
    currency: payment.currency,
    metadata: payment.metadata,
  })

  if (payment.unlockType === 'edit') return
  await upsertEntitlement({
    sessionId: payment.sessionId,
    cvId: payment.cvId,
    type: 'edit',
    source: payment.provider,
    orderId: `${payment.orderId || payment.checkoutId}:edit`,
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
    reference: String(data?.reference || ''),
    sessionId: metadata.sessionId,
    cvId: metadata.cvId,
    unlockType: metadata.unlockType,
    orderId: String(data?.reference || ''),
    checkoutId: String(data?.id || data?.reference || ''),
    customerEmail: data?.customer?.email || null,
    amount: Number(data?.amount || 0),
    currency: String(data?.currency || '').toUpperCase(),
    metadata: data || {},
    status: data?.status,
  }
}

function fromFlutterwavePayment(data) {
  const metadata = data?.meta || data?.metadata || {}
  return {
    provider: 'flutterwave',
    reference: String(data?.tx_ref || ''),
    sessionId: metadata.sessionId,
    cvId: metadata.cvId,
    unlockType: metadata.unlockType,
    orderId: String(data?.tx_ref || data?.flw_ref || ''),
    checkoutId: String(data?.id || data?.transaction_id || ''),
    customerEmail: data?.customer?.email || null,
    amount: Math.round(Number(data?.amount || 0) * 100),
    currency: String(data?.currency || '').toUpperCase(),
    metadata: data || {},
    status: data?.status,
  }
}

async function createPaymentAttempt({ provider, reference, sessionId, cvId, unlockType, customerEmail, currency, amount }) {
  return PaymentAttempt.create({
    provider,
    reference,
    sessionId,
    cvId,
    unlockType,
    amount: amount || PRICE_CENTS,
    currency: currency || getCurrencyForProvider(provider),
    customerEmail: customerEmail || null,
    expiresAt: new Date(Date.now() + CHECKOUT_TTL_MINUTES * 60 * 1000),
  })
}

async function findReusableAttempt({ provider, sessionId, cvId, unlockType }) {
  return PaymentAttempt.findOne({
    provider,
    sessionId,
    cvId,
    unlockType,
    status: 'pending',
    checkoutUrl: { $ne: null },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 }).lean()
}

async function hasActiveEntitlement(sessionId, cvId, unlockType) {
  const types = unlockType === 'download' ? ['download'] : ['edit']
  return Entitlement.exists({ sessionId, cvId, type: { $in: types }, active: true })
}

async function markAttemptFailed(reference, providerResponse) {
  return PaymentAttempt.updateOne(
    { reference, status: 'pending' },
    { $set: { status: 'failed', verifiedAt: new Date(), metadata: { providerResponse } } }
  )
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
  if (!secretKey || !transactionId) return null

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const json = await response.json()
  if (!response.ok || json.status !== 'success') return null
  return json.data
}

async function verifyFlutterwaveTxRef(reference) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY
  if (!secretKey || !reference) return null

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
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

function verifyFlutterwaveWebhook(req, rawBody) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH
  if (!secretHash) return

  const legacySignature = req.headers['verif-hash']
  const hmacSignature = req.headers['flutterwave-signature']
  const hmacDigest = crypto.createHmac('sha256', secretHash).update(rawBody).digest('hex')

  if (!safeCompare(legacySignature, secretHash) && !safeCompare(hmacSignature, hmacDigest)) {
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

function safeReturnUrl(url, origin, cvId) {
  const fallback = `${origin}/cv/${encodeURIComponent(cvId)}`
  if (!url) return fallback

  try {
    const parsed = new URL(url, origin)
    const allowedOrigins = new Set([origin])
    String(process.env.PAYMENT_ALLOWED_REDIRECT_ORIGINS || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
      .forEach(value => allowedOrigins.add(value))

    if (!allowedOrigins.has(parsed.origin)) return fallback
    return parsed.toString()
  } catch {
    return fallback
  }
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
  // If no valid email provided, throw an error instead of using fallback
  const err = new Error('A valid email address is required for payment')
  err.statusCode = 400
  throw err
}

function createReference(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(12).toString('hex')}`
}

function detectWebhookProvider(req) {
  if (req.headers['x-paystack-signature']) return 'paystack'
  if (req.headers['verif-hash'] || req.headers['flutterwave-signature']) return 'flutterwave'
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
