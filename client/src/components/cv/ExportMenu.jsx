
import { useEffect, useState } from 'react'
import {
  X, FileDown, FileJson, Printer, Loader2,
  BadgeDollarSign, Play, ShieldCheck, RefreshCw,
} from 'lucide-react'
import { exportCVasPDF } from '../../utils/exportPDF.js'
import { downloadJSON }   from '../../utils/io.js'
import { paymentAPI }     from '../../utils/api.js'
import { useStore }       from '../../store/index.js'
import RewardedAdGate     from '../ads/RewardedAdGate.jsx'

export default function ExportMenu({ cv, onClose }) {
  const [loading, setLoading]         = useState(null)
  const [error, setError]             = useState('')
  const [showRewardedAd, setShowRewardedAd] = useState(false)
  const [customerEmail, setCustomerEmail]   = useState(cv?.sections?.personal?.data?.email || '')
  const [emailError, setEmailError]   = useState('')

  const sessionId        = useStore(s => s.sessionId)
  const { updateCVPayment, markCVDownloaded, unlockCVAccess } = useStore()
  const downloadUnlocked = cv.monetization?.downloadUnlocked

  // ── Validate email ───────────────────────────────────────────────────
  const validateEmail = (v) => {
    if (!v.trim()) return 'Email is required to send your receipt'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address'
    return ''
  }

  // ── Pay with Paystack / Flutterwave ─────────────────────────────────
  const startCheckout = async (provider) => {
    const err = validateEmail(customerEmail)
    if (err) { setEmailError(err); return }
    if (!sessionId || !cv?.id) { setError('Session error. Reload the page.'); return }
    setLoading(`pay-${provider}`)
    setError('')
    setEmailError('')
    try {
      const { data } = await paymentAPI.createCheckout({
        provider,
        sessionId,
        cvId: cv.id,
        cvTitle:       cv.title || 'Untitled CV',
        unlockType:    'download',
        customerEmail: customerEmail.trim(),
        redirectUrl:   `${window.location.origin}/cv/${cv.id}?payment=success`,
      })
      updateCVPayment(cv.id, { lastCheckoutAt: new Date().toISOString() })
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to start checkout. Please try again.')
      setLoading(null)
    }
  }

  // ── Rewarded ad completed ────────────────────────────────────────────
  const handleAdComplete = async (verifyData) => {
    setShowRewardedAd(false)
    if (verifyData?.downloadToken || verifyData?.success) {
      try {
        await paymentAPI.recordAdUnlock({ sessionId, cvId: cv.id, unlockType: 'download' })
      } catch { /* non-fatal */ }
      unlockCVAccess(cv.id, 'rewarded_ad', 'download')
    } else {
      setError('Ad verification failed. Please try again or pay to download.')
    }
  }

  // ── Refresh entitlement ──────────────────────────────────────────────
  const refreshEntitlement = async () => {
    setLoading('refresh'); setError('')
    try {
      const { data } = await paymentAPI.getStatus(sessionId, cv.id)
      updateCVPayment(cv.id, {
        downloadUnlocked: Boolean(data.downloadUnlocked || cv.monetization?.downloadUnlocked),
        paidAt:    data.downloadUnlocked ? new Date().toISOString() : cv.monetization?.paidAt,
        unlockedBy: data.downloadUnlocked ? 'payment' : cv.monetization?.unlockedBy,
      })
    } catch {
      setError('Could not verify. Try again in a moment.')
    } finally {
      setLoading(null)
    }
  }

  // ── Download actions ─────────────────────────────────────────────────
  const handlePDF = async () => {
    if (!downloadUnlocked) return
    setLoading('pdf')
    try { await exportCVasPDF(cv); markCVDownloaded(cv.id) }
    finally { setLoading(null) }
  }
  const handlePrint = () => {
    if (!downloadUnlocked) return
    markCVDownloaded(cv.id); window.print()
  }
  const handleJSON = () => {
    if (!downloadUnlocked) return
    setLoading('json')
    downloadJSON(JSON.stringify({ cv }, null, 2), `${(cv.title || 'cv').replace(/\s+/g, '-').toLowerCase()}.json`)
    markCVDownloaded(cv.id)
    setTimeout(() => setLoading(null), 600)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-start justify-center pt-16 px-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative card w-full max-w-sm p-5 z-10 animate-fade-up my-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Export Document</h2>
            <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
          </div>

          {/* ── LOCKED: show ad + payment options ── */}
          {!downloadUnlocked && (
            <div className="mb-4 space-y-4">              {/* Unlock panel */}
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <ShieldCheck size={18} className="mt-0.5 text-amber-300 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-obsidian-100">Unlock to download your CV</p>
                    <p className="mt-1 text-xs leading-relaxed text-obsidian-400">
                      Pay once with Paystack or Flutterwave, or watch a short ad for free.
                    </p>
                  </div>
                </div>

                {/* Email field */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-obsidian-300 mb-1">
                    Email (for receipt)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => { setCustomerEmail(e.target.value); setEmailError('') }}
                    placeholder="your@email.com"
                    className={`w-full px-3 py-2 rounded-lg bg-obsidian-800 border text-sm text-obsidian-100 placeholder:text-obsidian-500 outline-none transition-colors ${emailError ? 'border-red-500/50' : 'border-obsidian-700 focus:border-amber-500/50'}`}
                  />
                  {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
                </div>

                {/* Payment buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => startCheckout('paystack')} disabled={!!loading?.startsWith?.('pay')}
                    className="btn-primary justify-center py-2.5 text-xs">
                    {loading === 'pay-paystack' ? <Loader2 size={13} className="animate-spin" /> : <BadgeDollarSign size={13} />}
                    Paystack
                  </button>
                  <button onClick={() => startCheckout('flutterwave')} disabled={!!loading?.startsWith?.('pay')}
                    className="btn-secondary justify-center py-2.5 text-xs">
                    {loading === 'pay-flutterwave' ? <Loader2 size={13} className="animate-spin" /> : <BadgeDollarSign size={13} />}
                    Flutterwave
                  </button>
                </div>

                {/* Watch ad button */}
                <button disabled 
                  onClick={() => setShowRewardedAd(true)}
                  className="w-full btn-ghost border border-obsidian-700 justify-center py-2.5 text-xs hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                >
                  <Play size={13} />
                  Watch 90-second ad — Free
                </button>

                {/* Already paid link */}
                <button onClick={refreshEntitlement} disabled={loading === 'refresh'}
                  className="mt-2 w-full btn-ghost justify-center py-1.5 text-[11px] text-obsidian-500">
                  {loading === 'refresh' ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  I already paid — restore access
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          {/* ── Download buttons (enabled when unlocked) ── */}
          <div className="space-y-2.5">
            {[
              {
                icon: FileDown, color: 'red', label: 'Download PDF',
                sub: 'High-quality print-ready PDF', action: handlePDF, loadKey: 'pdf',
              },
              {
                icon: Printer, color: 'blue', label: 'Print / Save as PDF',
                sub: 'Browser native print dialog', action: handlePrint, loadKey: null,
              },
              {
                icon: FileJson, color: 'emerald', label: 'Export as JSON',
                sub: 'Backup and restore your CV data', action: handleJSON, loadKey: 'json',
              },
            ].map(({ icon: Icon, color, label, sub, action, loadKey }) => (
              <button
                key={label}
                onClick={action}
                disabled={!downloadUnlocked || loading === loadKey}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-obsidian-700 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 text-left disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  {loading === loadKey
                    ? <Loader2 size={18} className={`text-${color}-400 animate-spin`} />
                    : <Icon size={18} className={`text-${color}-400`} />
                  }
                </div>
                <div>
                  <p className="font-semibold text-sm text-obsidian-100">{label}</p>
                  <p className="text-xs text-obsidian-500 mt-0.5">{sub}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-obsidian-700 text-center mt-4 leading-relaxed">
            Your CV data is stored in your browser. Exporting makes a permanent copy.
          </p>
        </div>
      </div>

      {/* Rewarded ad gate modal */}
      {showRewardedAd && (
        <RewardedAdGate
          cvId={cv.id}
          sessionId={sessionId}
          onComplete={handleAdComplete}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </>
  )
}
