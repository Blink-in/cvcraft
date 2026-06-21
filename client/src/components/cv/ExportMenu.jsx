import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, FileDown, FileJson, Loader2, Printer, RefreshCw, ShieldCheck, X,
} from 'lucide-react'
import { exportCVasPDF } from '../../utils/exportPDF.js'
import { downloadJSON } from '../../utils/io.js'
import { paymentAPI } from '../../utils/api.js'
import { useStore } from '../../store/index.js'

export default function ExportMenu({ cv, onClose }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const sessionId = useStore(s => s.sessionId)
  const { updateCVPayment, markCVDownloaded } = useStore()
  const downloadUnlocked = cv.monetization?.downloadUnlocked

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
      if (!data.downloadUnlocked) setError('No completed unlock was found yet.')
    } catch {
      setError('Could not verify. Try again in a moment.')
    } finally {
      setLoading(null)
    }
  }

  const handleUnlock = () => {
    onClose?.()
    navigate(`/unlock/${cv.id}`)
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

  const handlePrint = () => {
    if (!downloadUnlocked) return
    markCVDownloaded(cv.id)
    window.print()
  }

  const handleJSON = () => {
    if (!downloadUnlocked) return
    setLoading('json')
    downloadJSON(JSON.stringify({ cv }, null, 2), `${(cv.title || 'cv').replace(/\s+/g, '-').toLowerCase()}.json`)
    markCVDownloaded(cv.id)
    setTimeout(() => setLoading(null), 600)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto px-4 pt-16">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 my-4 w-full max-w-sm animate-fade-up card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Export Document</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
        </div>

        {!downloadUnlocked && (
          <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/8 p-4">
            <div className="mb-3 flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-amber-300" />
              <div>
                <p className="text-sm font-semibold text-obsidian-100">Unlock to download your CV</p>
                <p className="mt-1 text-xs leading-relaxed text-obsidian-400">
                  Choose Paystack, Flutterwave, or an ad-supported unlock on the download access page.
                </p>
              </div>
            </div>
            <button onClick={handleUnlock} className="btn-primary w-full justify-center py-2.5 text-xs">
              Unlock download <ArrowRight size={13} />
            </button>
            <button
              onClick={refreshEntitlement}
              disabled={loading === 'refresh'}
              className="mt-2 w-full btn-ghost justify-center py-1.5 text-[11px] text-obsidian-500"
            >
              {loading === 'refresh' ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              Restore access
            </button>
          </div>
        )}

        {error && (
          <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-2.5">
          {[
            { icon: FileDown, color: 'red', label: 'Download PDF', sub: 'High-quality print-ready PDF', action: handlePDF, loadKey: 'pdf' },
            { icon: Printer, color: 'blue', label: 'Print / Save as PDF', sub: 'Browser native print dialog', action: handlePrint, loadKey: null },
            { icon: FileJson, color: 'emerald', label: 'Export as JSON', sub: 'Backup and restore your CV data', action: handleJSON, loadKey: 'json' },
          ].map(({ icon: Icon, color, label, sub, action, loadKey }) => (
            <button
              key={label}
              onClick={action}
              disabled={!downloadUnlocked || loading === loadKey}
              className="flex w-full items-center gap-4 rounded-xl border border-obsidian-700 p-4 text-left transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-${color}-500/10 border border-${color}-500/20`}>
                {loading === loadKey
                  ? <Loader2 size={18} className={`text-${color}-400 animate-spin`} />
                  : <Icon size={18} className={`text-${color}-400`} />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-obsidian-100">{label}</p>
                <p className="mt-0.5 text-xs text-obsidian-500">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-obsidian-700">
          Your CV data is stored in your browser. Exporting makes a permanent copy.
        </p>
      </div>
    </div>
  )
}
