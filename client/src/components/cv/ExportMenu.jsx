import { useEffect, useState } from 'react'
import { X, FileDown, FileJson, Printer, Loader2, BadgeDollarSign, Clapperboard, ShieldCheck, RefreshCw } from 'lucide-react'
import { exportCVasPDF } from '../../utils/exportPDF.js'
import { downloadJSON } from '../../utils/io.js'
import { paymentAPI } from '../../utils/api.js'
import { useStore } from '../../store/index.js'

export default function ExportMenu({ cv, onClose }) {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')
  const [adOpen, setAdOpen] = useState(false)
  const [adSeconds, setAdSeconds] = useState(0)
  const [adAvailable, setAdAvailable] = useState(false)
  const [customerEmail, setCustomerEmail] = useState(cv?.sections?.personal?.data?.email || '')
  const [emailError, setEmailError] = useState('')
  const sessionId = useStore(s => s.sessionId)
  const { updateCVPayment, markCVDownloaded, unlockCVAccess } = useStore()

  const downloadUnlocked = cv.monetization?.downloadUnlocked

  useEffect(() => {
    setAdAvailable(Boolean(window?.CVCraftRewardedAdAvailable))
  }, [])

  const refreshEntitlement = async () => {
    setLoading('refresh')
    setError('')
    try {
      const { data } = await paymentAPI.getStatus(sessionId, cv.id)
      const paidSource = data.entitlements?.find(e => e.source && e.source !== 'rewarded_ad')?.source || cv.monetization?.unlockedBy
      updateCVPayment(cv.id, {
        downloadUnlocked: Boolean(data.downloadUnlocked || cv.monetization?.downloadUnlocked),
        editUnlocked: Boolean(data.editUnlocked || cv.monetization?.editUnlocked),
        paidAt: data.downloadUnlocked ? new Date().toISOString() : cv.monetization?.paidAt,
        unlockedBy: data.downloadUnlocked ? paidSource : cv.monetization?.unlockedBy,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not verify payment yet. Try again in a moment.')
    } finally {
      setLoading(null)
    }
  }

  const validateEmail = (email) => {
    const trimmed = email.trim()
    if (!trimmed) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address'
    return ''
  }

  const startCheckout = async (provider, unlockType = 'download') => {
    if (!sessionId || !cv?.id) {
      setError('Missing session or CV identifier. Reload the page and try again.')
      return
    }

    const emailValidationError = validateEmail(customerEmail)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    setLoading(`pay-${provider}-${unlockType}`)
    setError('')
    setEmailError('')
    try {
      const { data } = await paymentAPI.createCheckout({
        provider,
        sessionId,
        cvId: cv.id,
        cvTitle: cv.title || 'Untitled CV',
        unlockType,
        customerEmail: customerEmail.trim(),
        redirectUrl: `${window.location.origin}/cv/${cv.id}?payment=success`,
      })
      updateCVPayment(cv.id, { lastCheckoutAt: new Date().toISOString() })
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to start checkout.')
      setLoading(null)
    }
  }

  const startRewardedAd = async () => {
    if (!adAvailable) {
      setError('Rewarded ads are not available yet. Please use Paystack or Flutterwave.')
      return
    }

    setError('')
    setAdOpen(true)

    if (window.CVCraftRewardedAd?.show) {
      try {
        const watched = await window.CVCraftRewardedAd.show()
        if (watched) await completeAdUnlock()
        else setError('Please finish the ad to unlock this CV.')
      } catch {
        setError('The ad provider was not available. Try paying or refresh and try again.')
      } finally {
        setAdOpen(false)
      }
      return
    }

    setError('Rewarded ads are not available yet. Please use Paystack or Flutterwave.')
    setAdOpen(false)
  }

  const completeAdUnlock = async () => {
    if (!sessionId || !cv?.id) {
      setError('Missing session or CV identifier. Reload the page and try again.')
      return
    }

    setLoading('ad')
    try {
      await paymentAPI.recordAdUnlock({ sessionId, cvId: cv.id, unlockType: 'download' })
      unlockCVAccess(cv.id, 'rewarded_ad', 'download')
    } catch {
      setError('Rewarded ads are not available yet. Please use Paystack or Flutterwave.')
    } finally {
      setLoading(null)
    }
  }

  const handlePDF = async () => {
    if (!downloadUnlocked) return
    setLoading('pdf')
    try {
      await exportCVasPDF(cv)
      markCVDownloaded(cv.id)
    } finally {
      setLoading(null)
    }
  }

  const handleJSON = () => {
    if (!downloadUnlocked) return
    setLoading('json')
    const json = JSON.stringify({ cv }, null, 2)
    const filename = `${(cv.title || 'cv').replace(/\s+/g, '-').toLowerCase()}.json`
    downloadJSON(json, filename)
    markCVDownloaded(cv.id)
    setTimeout(() => setLoading(null), 600)
  }

  const handlePrint = () => {
    if (!downloadUnlocked) return
    markCVDownloaded(cv.id)
    window.print()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-sm p-5 z-10 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Export Document</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
        </div>

        {!downloadUnlocked && (
          <div className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
            <div className="flex items-start gap-3 mb-3">
              <ShieldCheck size={18} className="mt-0.5 text-amber-300" />
              <div>
                <p className="text-sm font-semibold text-obsidian-100">Unlock this CV to download</p>
                <p className="mt-1 text-xs leading-relaxed text-obsidian-400">
                  Pay once with Paystack or Flutterwave, or watch a rewarded ad. Paid CVs can be downloaded again from your dashboard.
                </p>
              </div>
            </div>

            <div className="mb-3 space-y-2">
              <label className="text-xs font-semibold text-obsidian-200 block">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value)
                  setEmailError('')
                }}
                placeholder="your@email.com"
                disabled={loading?.startsWith?.('pay')}
                className={`w-full px-3 py-2 rounded-lg bg-obsidian-800 border text-sm text-obsidian-100 placeholder:text-obsidian-500 outline-none transition-colors ${
                  emailError
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-obsidian-700 focus:border-amber-500/50'
                }`}
              />
              {emailError && <p className="text-xs text-red-400">{emailError}</p>}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => startCheckout('paystack', 'download')}
                disabled={loading?.startsWith?.('pay')}
                className="btn-primary justify-center py-2 text-xs"
              >
                {loading === 'pay-paystack-download' ? <Loader2 size={14} className="animate-spin" /> : <BadgeDollarSign size={14} />}
                Paystack
              </button>
              <button
                onClick={() => startCheckout('flutterwave', 'download')}
                disabled={loading?.startsWith?.('pay')}
                className="btn-secondary justify-center py-2 text-xs"
              >
                {loading === 'pay-flutterwave-download' ? <Loader2 size={14} className="animate-spin" /> : <BadgeDollarSign size={14} />}
                Flutterwave
              </button>
              <button
                onClick={startRewardedAd}
                disabled={loading === 'ad' || !adAvailable}
                className="btn-secondary col-span-2 justify-center py-2 text-xs"
              >
                {loading === 'ad' ? <Loader2 size={14} className="animate-spin" /> : <Clapperboard size={14} />}
                {adAvailable ? 'Watch Ad' : 'Watch Ad (coming soon)'}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-obsidian-400">
              {adAvailable
                ? 'Rewarded ad unlocks are enabled.'
                : 'Rewarded ads are not configured yet. Coming soon.'}
            </p>
            <button
              onClick={refreshEntitlement}
              disabled={loading === 'refresh'}
              className="mt-2 w-full btn-ghost justify-center py-1.5 text-[11px]"
            >
              {loading === 'refresh' ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              I already paid
            </button>
          </div>
        )}

        {error && (
          <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-2.5">
          <button
            onClick={handlePDF}
            disabled={!downloadUnlocked || loading === 'pdf'}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              {loading === 'pdf' ? <Loader2 size={18} className="text-red-400 animate-spin" /> : <FileDown size={18} className="text-red-400" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Download PDF</p>
              <p className="text-xs text-obsidian-500 mt-0.5">High-fidelity print-ready export</p>
            </div>
          </button>

          <button
            onClick={handlePrint}
            disabled={!downloadUnlocked}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Printer size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Print / Save as PDF</p>
              <p className="text-xs text-obsidian-500 mt-0.5">Use browser's native print dialog</p>
            </div>
          </button>

          <button
            onClick={handleJSON}
            disabled={!downloadUnlocked || loading === 'json'}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              {loading === 'json' ? <Loader2 size={18} className="text-emerald-400 animate-spin" /> : <FileJson size={18} className="text-emerald-400" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-obsidian-100">Export as JSON</p>
              <p className="text-xs text-obsidian-500 mt-0.5">Backup & restore your CV data</p>
            </div>
          </button>
        </div>

        <p className="text-[10px] text-obsidian-600 text-center mt-4 leading-relaxed">
          PDF export uses your browser's print engine for best fidelity.<br />
          JSON export lets you restore this CV on any device.
        </p>
      </div>

      {adOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="card w-full max-w-xs p-5 text-center">
            <Clapperboard size={28} className="mx-auto mb-3 text-amber-300" />
            <p className="text-sm font-semibold text-obsidian-100">Sponsored unlock</p>
            <p className="mt-2 text-xs leading-relaxed text-obsidian-400">
              Keep this window open until the ad finishes. Your CV unlocks automatically.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-obsidian-800">
              <div className="h-full bg-amber-400 transition-all" style={{ width: `${((60 - adSeconds) / 60) * 100}%` }} />
            </div>
            <p className="mt-3 text-xs text-obsidian-500">{adSeconds}s remaining</p>
          </div>
        </div>
      )}
    </div>
  )
}
