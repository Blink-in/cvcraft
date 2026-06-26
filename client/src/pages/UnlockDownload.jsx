import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, BadgeDollarSign, CheckCircle2, Clock, Download, FileText,
  HelpCircle, Loader2, Play, RefreshCw, ShieldCheck,
} from 'lucide-react'
import { useStore } from '../store/index.js'
import { paymentAPI } from '../utils/api.js'
import AdSenseSlot from '../components/ads/AdSenseSlot.jsx'
import RewardedAdGate from '../components/ads/RewardedAdGate.jsx'

const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_UNLOCK_SLOT

export default function UnlockDownload() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cv = useStore(s => s.cvs.find(item => item.id === id))
  const sessionId = useStore(s => s.sessionId)
  const { updateCVPayment, unlockCVAccess } = useStore()

  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showRewardedAd, setShowRewardedAd] = useState(false)
  const [adAvailable, setAdAvailable] = useState(false)

  useEffect(() => {
    if (cv?.sections?.personal?.data?.email) {
      setCustomerEmail(cv.sections.personal.data.email)
    }
  }, [cv?.id])

  useEffect(() => {
    setAdAvailable(Boolean(window?.CVCraftRewardedAdAvailable))
  }, [])

  if (!cv) return <Navigate to="/dashboard" replace />

  const downloadUnlocked = cv.monetization?.downloadUnlocked

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required for your payment receipt.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address.'
    return ''
  }

  const startCheckout = async (provider) => {
    const validation = validateEmail(customerEmail)
    if (validation) {
      setEmailError(validation)
      return
    }

    setLoading(provider)
    setError('')
    setEmailError('')

    try {
      const { data } = await paymentAPI.createCheckout({
        provider,
        sessionId,
        cvId: cv.id,
        cvTitle: cv.title || 'Untitled CV',
        unlockType: 'download',
        customerEmail: customerEmail.trim(),
        redirectUrl: `${window.location.origin}/thank-you/${cv.id}?payment=success`,
      })
      updateCVPayment(cv.id, { lastCheckoutAt: new Date().toISOString() })
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to start checkout. Please try again.')
      setLoading(null)
    }
  }

  const refreshEntitlement = async () => {
    setLoading('refresh')
    setError('')
    try {
      const { data } = await paymentAPI.getStatus(sessionId, cv.id)
      updateCVPayment(cv.id, {
        downloadUnlocked: Boolean(data.downloadUnlocked || cv.monetization?.downloadUnlocked),
        paidAt: data.downloadUnlocked ? new Date().toISOString() : cv.monetization?.paidAt,
        unlockedBy: data.downloadUnlocked ? 'payment' : cv.monetization?.unlockedBy,
      })
      if (data.downloadUnlocked) navigate(`/cv/${cv.id}`)
      else setError('No completed unlock was found yet. If you just paid, try again in a moment.')
    } catch {
      setError('Could not verify your unlock. Try again in a moment.')
    } finally {
      setLoading(null)
    }
  }

  const handleAdComplete = async (verifyData) => {
    setShowRewardedAd(false)
    if (!verifyData?.downloadToken && !verifyData?.success) {
      setError('Ad verification failed. Please try again or use a payment option.')
      return
    }

    try {
      await paymentAPI.recordAdUnlock({ sessionId, cvId: cv.id, unlockType: 'download' })
      unlockCVAccess(cv.id, 'rewarded_ad', 'download')
      navigate(`/cv/${cv.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Rewarded ad unlocks are not available yet.')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-950 font-body px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate(`/cv/${cv.id}`)} className="mb-6 btn-ghost px-3 py-1.5 text-xs">
          <ArrowLeft size={14} /> Back to editor
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <main className="space-y-6">
            <section className="card p-7 md:p-9">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                  <Download size={23} className="text-amber-400" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold leading-tight text-obsidian-100">
                    Unlock your CV download
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-obsidian-400">
                    Choose the option that works best for you. Paid unlocks are verified by Paystack or Flutterwave.
                    The ad-supported option appears only when a verifiable rewarded-ad provider is configured.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['One document', 'Unlock PDF, print, and JSON export for this CV.'],
                  ['Private by default', 'Your CV stays in your browser unless payment verification is required.'],
                  ['Restore access', 'Use the restore button if your payment succeeded but the editor did not update.'],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-lg border border-obsidian-800 bg-obsidian-900/60 p-4">
                    <CheckCircle2 size={15} className="mb-2 text-emerald-400" />
                    <p className="text-sm font-semibold text-obsidian-100">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-obsidian-500">{copy}</p>
                  </div>
                ))}
              </div>
            </section>

            <AdSenseSlot slot={ADSENSE_SLOT} className="card p-4" />

            <section className="card p-7">
              <div className="mb-4 flex items-center gap-3">
                <FileText size={20} className="text-amber-400" />
                <h2 className="font-display text-xl font-bold text-obsidian-100">What happens after unlock?</h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-obsidian-400">
                <p>
                  Your editor stays the same. Once the download is unlocked, return to the export menu and choose
                  PDF, browser print, or JSON backup. The exported file is generated from the CV preview you already
                  reviewed, so you can still make edits before saving the final copy.
                </p>
                <p>
                  We keep this page separate from the editor so ads do not appear on empty dashboards, navigation
                  screens, alerts, or unfinished user documents. That keeps the experience cleaner for you and makes
                  ad placement easier to review.
                </p>
              </div>
            </section>

            <section className="card p-7">
              <div className="mb-4 flex items-center gap-3">
                <HelpCircle size={20} className="text-amber-400" />
                <h2 className="font-display text-xl font-bold text-obsidian-100">Unlock questions</h2>
              </div>
              <div className="space-y-5 text-sm leading-relaxed text-obsidian-400">
                <div>
                  <h3 className="mb-1 font-semibold text-obsidian-100">Why is the ad option sometimes unavailable?</h3>
                  <p>
                    Rewarded downloads need a real ad session that can be verified before access is granted. If that
                    provider is not active, the button stays unavailable instead of showing a fake timer or placeholder ad.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-obsidian-100">Can I still edit before downloading?</h3>
                  <p>
                    Yes. Go back to the editor, adjust your content or template, then return here when you are ready
                    to unlock the final export.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-obsidian-100">What if payment succeeds but access is not restored?</h3>
                  <p>
                    Use restore access below. If it still does not work, contact support with your payment reference
                    and the email address used at checkout.
                  </p>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <section className="card p-6">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck size={21} className="text-amber-400" />
                <div>
                  <h2 className="font-display text-xl font-bold text-obsidian-100">Download access</h2>
                  <p className="text-xs text-obsidian-500">{cv.title || 'Untitled CV'}</p>
                </div>
              </div>

              {downloadUnlocked ? (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-sm font-semibold text-emerald-300">This CV is unlocked.</p>
                  <button onClick={() => navigate(`/cv/${cv.id}`)} className="mt-4 btn-primary w-full justify-center">
                    Return to export
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="input-label">Receipt email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={event => { setCustomerEmail(event.target.value); setEmailError('') }}
                      placeholder="your@email.com"
                      className={`input-field ${emailError ? 'border-red-500/50' : ''}`}
                    />
                    {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => startCheckout('paystack')} disabled={Boolean(loading)} className="btn-primary justify-center py-2.5 text-xs">
                      {loading === 'paystack' ? <Loader2 size={13} className="animate-spin" /> : <BadgeDollarSign size={13} />}
                      Paystack
                    </button>
                    <button onClick={() => startCheckout('flutterwave')} disabled={Boolean(loading)} className="btn-secondary justify-center py-2.5 text-xs">
                      {loading === 'flutterwave' ? <Loader2 size={13} className="animate-spin" /> : <BadgeDollarSign size={13} />}
                      Flutterwave
                    </button>
                  </div>

                  <div className="rounded-lg border border-obsidian-800 bg-obsidian-900/70 p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <Clock size={16} className="mt-0.5 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-sm font-semibold text-obsidian-100">Ad-supported unlock</p>
                        <p className="mt-1 text-xs leading-relaxed text-obsidian-500">
                          Watch a 90-second sponsored video when rewarded ads are available.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRewardedAd(true)}
                      disabled={!adAvailable || Boolean(loading)}
                      className="btn-ghost w-full justify-center border border-obsidian-700 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Play size={13} />
                      {adAvailable ? 'Watch 90-second ad' : 'Rewarded ad not available'}
                    </button>
                  </div>

                  <button onClick={refreshEntitlement} disabled={loading === 'refresh'} className="btn-ghost w-full justify-center py-2 text-xs text-obsidian-500">
                    {loading === 'refresh' ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    Restore access
                  </button>
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300">
                  {error}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>

      {showRewardedAd && (
        <RewardedAdGate
          cvId={cv.id}
          sessionId={sessionId}
          onComplete={handleAdComplete}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  )
}
