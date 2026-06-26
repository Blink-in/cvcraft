import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { X, CheckCircle2, Download } from 'lucide-react'
import { useStore } from '../store/index.js'
import { paymentAPI } from '../utils/api.js'
import { getPaymentProviderFromReturn } from '../pages/CVBuilder.jsx'

export default function ThankYou() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = useStore(s => s.sessionId)
  const cv = useStore(s => s.cvs.find(c => c.id === id))
  const updateCVPayment = useStore(s => s.updateCVPayment)

  if (!cv || !id) return <Navigate to="/dashboard" replace />

  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!cv || !id) return
    let alive = true
    const verify = async () => {
      try {
        const { data } = await paymentAPI.getStatus(sessionId, cv.id, Object.fromEntries(searchParams.entries()))
        const paidSource = getPaymentProviderFromReturn(searchParams, data)
        if (!alive) return
        const unlocked = Boolean(data.downloadUnlocked || cv.monetization?.downloadUnlocked)
        setSuccess(unlocked)
        updateCVPayment(cv.id, {
          downloadUnlocked: unlocked,
          paidAt: unlocked ? new Date().toISOString() : cv.monetization?.paidAt,
          unlockedBy: unlocked ? paidSource : cv.monetization?.unlockedBy,
        })
      } catch {
        if (alive) setSuccess(false)
      } finally {
        if (alive) setVerifying(false)
      }
    }
    verify()
    return () => { alive = false }
  }, [cv?.id, id, sessionId, searchParams, cv, updateCVPayment])

  return (
    <div className="min-h-screen bg-obsidian-950">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-5">
        <div className="relative w-full">
          <button
            onClick={() => navigate(`/cv/${id}`)}
            className="absolute -top-2 right-0 rounded-full p-2 text-obsidian-400 transition hover:bg-obsidian-800 hover:text-obsidian-100"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {verifying ? (
            <div className="card flex flex-col items-center gap-4 p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-sm text-obsidian-400">Verifying your payment...</p>
            </div>
          ) : success ? (
            <div className="card flex flex-col items-center gap-5 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 size={34} className="text-emerald-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-obsidian-100">
                Thank you, your order was completed
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-obsidian-400">
                Your CV download has been unlocked. You can now export your professional CV as PDF, print it, or save a JSON backup.
              </p>
              <button
                onClick={() => navigate(`/cv/${id}`)}
                className="btn-primary mt-2 w-full justify-center"
              >
                <Download size={16} />
                Go to your CV
              </button>
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-sm font-semibold text-amber-400">
                Payment received, but verification is still pending.
              </p>
              <p className="text-sm leading-relaxed text-obsidian-400">
                Your payment may take a few moments to process. You can return to the editor and click "I already paid" in the export menu.
              </p>
              <button
                onClick={() => navigate(`/cv/${id}`)}
                className="btn-primary mt-2 w-full justify-center"
              >
                Return to editor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
