import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/index.js'
import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Eye, EyeOff, Layout, Download, Settings, Lock, BadgeDollarSign, Clapperboard, Loader2 } from 'lucide-react'

import EditorSidebar from '../components/cv/EditorSidebar.jsx'
import CVPreview from '../components/cv/CVPreview.jsx'
import TemplateSelector from '../components/cv/TemplateSelector.jsx'
import CustomizationPanel from '../components/cv/CustomizationPanel.jsx'
import ExportMenu from '../components/cv/ExportMenu.jsx'
import { paymentAPI } from '../utils/api.js'

export default function CVBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setActiveCV, updateCV, updateCVPayment, unlockCVAccess } = useStore()
  const sessionId = useStore(s => s.sessionId)
  const cv = useStore(s => s.cvs.find(c => c.id === id))
  const activeSection = useStore(s => s.activeSection)
  const setActiveSection = useStore(s => s.setActiveSection)

  const [previewMode, setPreviewMode] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [titleEditing, setTitleEditing] = useState(false)
  const [unlocking, setUnlocking] = useState(null)
  const [unlockError, setUnlockError] = useState('')
  const adAvailable = Boolean(window?.CVCraftRewardedAdAvailable)

  useEffect(() => {
    if (!cv) { navigate('/dashboard'); return }
    setActiveCV(id)
  }, [id])

  useEffect(() => {
    if (!cv || cv.monetization?.downloadUnlocked) return

    const blockUnpaidCaptureShortcuts = (event) => {
      const key = String(event.key || '').toLowerCase()
      const printScreenBlocked = event.key === 'PrintScreen'

      if (!shortcutBlocked && !printScreenBlocked) return
      event.preventDefault()
      event.stopPropagation()
      setUnlockError('Unlock this CV before printing, saving, or capturing a clean copy.')
    }

    window.addEventListener('keydown', blockUnpaidCaptureShortcuts, true)
    return () => window.removeEventListener('keydown', blockUnpaidCaptureShortcuts, true)
  }, [cv?.id, cv?.monetization?.downloadUnlocked])

  useEffect(() => {
    if (!cv || searchParams.get('payment') !== 'success') return

    let alive = true
    const verifyPayment = async () => {
      setUnlocking('verify')
      setUnlockError('')
      try {
        const { data } = await paymentAPI.getStatus(sessionId, cv.id, Object.fromEntries(searchParams.entries()))
        const paidSource = getPaymentProviderFromReturn(searchParams, data)
        if (!alive) return
        updateCVPayment(cv.id, {
          downloadUnlocked: Boolean(data.downloadUnlocked || cv.monetization?.downloadUnlocked),
          editUnlocked: Boolean(data.editUnlocked || cv.monetization?.editUnlocked),
          paidAt: data.downloadUnlocked || data.editUnlocked ? new Date().toISOString() : cv.monetization?.paidAt,
          unlockedBy: data.downloadUnlocked || data.editUnlocked ? paidSource : cv.monetization?.unlockedBy,
        })
      } catch (err) {
        if (alive) setUnlockError(err.response?.data?.error || 'Payment received, but verification is still pending. Use Export > I already paid in a moment.')
      } finally {
        if (alive) {
          setUnlocking(null)
          setSearchParams({})
        }
      }
    }

    verifyPayment()
    return () => { alive = false }
  }, [cv?.id, searchParams])

  const handleTitleChange = useCallback((e) => {
    if (isEditLocked(cv)) return
    updateCV(id, c => ({ ...c, title: e.target.value }))
  }, [id, cv])

  const startEditCheckout = async (provider) => {
    setUnlocking(`pay-edit-${provider}`)
    setUnlockError('')
    try {
      const { data } = await paymentAPI.createCheckout({
        provider,
        sessionId,
        cvId: cv.id,
        cvTitle: cv.title,
        unlockType: 'edit',
        redirectUrl: `${window.location.origin}/cv/${cv.id}?payment=success`,
      })
      window.location.href = data.checkoutUrl
    } catch (err) {
      setUnlockError(err.response?.data?.error || 'Unable to start checkout.')
      setUnlocking(null)
    }
  }

  const unlockEditWithAd = async () => {
    setUnlocking('ad-edit')
    setUnlockError('')
    try {
      if (window.CVCraftRewardedAd?.show) {
        const watched = await window.CVCraftRewardedAd.show()
        if (!watched) throw new Error('Please finish the ad to unlock editing.')
      } else {
        await new Promise(resolve => setTimeout(resolve, 60000))
      }
      await paymentAPI.recordAdUnlock({ sessionId, cvId: cv.id, unlockType: 'edit' })
      unlockCVAccess(cv.id, 'rewarded_ad', 'edit')
    } catch (err) {
      setUnlockError(err.response?.data?.error || err.message || 'The ad provider was not available.')
    } finally {
      setUnlocking(null)
    }
  }

  if (!cv) return null
  const editLocked = isEditLocked(cv)

  return (
    <div className="flex flex-col h-screen bg-obsidian-950 font-body overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-obsidian-900 bg-obsidian-950 z-30 flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost py-1.5 px-2.5 text-xs">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <span className="text-obsidian-700">|</span>

        {/* Editable title */}
        {titleEditing ? (
          <input
            autoFocus
            value={cv.title}
            onChange={handleTitleChange}
            onBlur={() => setTitleEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setTitleEditing(false)}
            className="bg-transparent border-b border-amber-500/50 text-sm font-semibold text-obsidian-100 focus:outline-none px-0 w-40"
          />
        ) : (
          <button
            disabled={editLocked}
            onClick={() => setTitleEditing(true)}
            className="text-sm font-semibold text-obsidian-200 hover:text-obsidian-100 truncate max-w-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cv.title}
          </button>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button disabled={editLocked} onClick={() => { setShowTemplates(!showTemplates); setShowCustomize(false) }} className={`btn-ghost py-1.5 px-3 text-xs disabled:opacity-40 ${showTemplates ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            <Layout size={13} />
            <span className="hidden md:inline">Templates</span>
          </button>
          <button disabled={editLocked} onClick={() => { setShowCustomize(!showCustomize); setShowTemplates(false) }} className={`btn-ghost py-1.5 px-3 text-xs disabled:opacity-40 ${showCustomize ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            <Settings size={13} />
            <span className="hidden md:inline">Customize</span>
          </button>
          <button onClick={() => setPreviewMode(!previewMode)} className={`btn-ghost py-1.5 px-3 text-xs ${previewMode ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden md:inline">{previewMode ? 'Edit' : 'Preview'}</span>
          </button>
          <button onClick={() => setShowExport(!showExport)} className="btn-primary py-1.5 px-3 text-xs relative">
            <Download size={13} />
            Export
          </button>
        </div>
      </header>

      {/* ── Overlay panels ── */}
      {showTemplates && (
        <TemplateSelector cvId={id} cv={cv} onClose={() => setShowTemplates(false)} />
      )}
      {showCustomize && (
        <CustomizationPanel cvId={id} cv={cv} onClose={() => setShowCustomize(false)} />
      )}
      {showExport && (
        <ExportMenu cv={cv} onClose={() => setShowExport(false)} />
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor sidebar - hidden in full preview mode */}
        {!previewMode && !editLocked && (
          <EditorSidebar cv={cv} cvId={id} activeSection={activeSection} setActiveSection={setActiveSection} />
        )}
        {!previewMode && editLocked && (
          <LockedEditorPanel
            loading={unlocking}
            error={unlockError}
            adAvailable={adAvailable}
            onPay={startEditCheckout}
            onAd={unlockEditWithAd}
          />
        )}

        {/* Preview pane */}
        <div className={`flex-1 overflow-y-auto bg-obsidian-900/30 ${previewMode ? 'p-8' : 'p-4 md:p-8'}`}>
          <div className="flex justify-center">
            <CVPreview cv={cv} />
          </div>
        </div>
      </div>
    </div>
  )
}

function isEditLocked(cv) {
  return Boolean(cv?.monetization?.downloadedAt && !cv?.monetization?.editUnlocked)
}

function getPaymentProviderFromReturn(searchParams, data) {
  const provider = searchParams.get('provider') || searchParams.get('paymentProvider')
  const source = data?.entitlements?.find(e => e.source && e.source !== 'rewarded_ad')?.source
  return provider || source || 'paystack'
}

function LockedEditorPanel({ loading, error, adAvailable, onPay, onAd }) {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-obsidian-900 bg-obsidian-950/80 p-5">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
        <Lock size={20} className="mb-3 text-amber-300" />
        <h2 className="text-sm font-semibold text-obsidian-100">Editing is locked</h2>
        <p className="mt-2 text-xs leading-relaxed text-obsidian-400">
          This CV has already been downloaded. Unlock editing with Paystack, Flutterwave, or a rewarded ad; exports stay available after payment.
        </p>
        {error && <p className="mt-3 rounded border border-red-500/20 bg-red-500/10 px-2 py-1.5 text-xs text-red-300">{error}</p>}
        <div className="mt-4 space-y-2">
          <button onClick={() => onPay('paystack')} disabled={Boolean(loading)} className="btn-primary w-full justify-center py-2 text-xs">
            {loading === 'pay-edit-paystack' ? <Loader2 size={14} className="animate-spin" /> : <BadgeDollarSign size={14} />}
            Paystack
          </button>
          <button onClick={() => onPay('flutterwave')} disabled={Boolean(loading)} className="btn-secondary w-full justify-center py-2 text-xs">
            {loading === 'pay-edit-flutterwave' ? <Loader2 size={14} className="animate-spin" /> : <BadgeDollarSign size={14} />}
            Flutterwave
          </button>
          <button onClick={onAd} disabled={Boolean(loading) || !adAvailable} className="btn-secondary w-full justify-center py-2 text-xs">
            {loading === 'ad-edit' ? <Loader2 size={14} className="animate-spin" /> : <Clapperboard size={14} />}
            {adAvailable ? 'Watch Ad to Edit' : 'Watch Ad (coming soon)'}
          </button>
          {!adAvailable && (
            <p className="mt-2 text-xs text-obsidian-400">Rewarded ad unlocks are not available yet. Use Paystack or Flutterwave to unlock editing.</p>
          )}
        </div>
      </div>
    </aside>
  )
}
