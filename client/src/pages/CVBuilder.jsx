import { useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useStore } from '../store/index.js'
import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Eye, EyeOff, Layout, Download, Settings } from 'lucide-react'

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
  const { setActiveCV, updateCV, updateCVPayment } = useStore()
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
  const [adAvailable, setAdAvailable] = useState(false)

  useEffect(() => {
    setAdAvailable(Boolean(window?.CVCraftRewardedAdAvailable))
  }, [])

  useEffect(() => {
    if (cv) setActiveCV(id)
  }, [id, cv, setActiveCV])

  useEffect(() => {
    if (!cv || cv.monetization?.downloadUnlocked) return

    const blockUnpaidCaptureShortcuts = (event) => {
      const key = String(event.key || '').toLowerCase()
      const shortcutBlocked = (event.ctrlKey || event.metaKey) && ['p', 's'].includes(key)
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
          paidAt: data.downloadUnlocked ? new Date().toISOString() : cv.monetization?.paidAt,
          unlockedBy: data.downloadUnlocked ? paidSource : cv.monetization?.unlockedBy,
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
    updateCV(id, c => ({ ...c, title: e.target.value }))
  }, [id, updateCV])

  if (!cv) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex flex-col h-screen bg-obsidian-950 font-body overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-obsidian-900 bg-obsidian-950 z-30 flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost py-1.5 px-2.5 text-xs">
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <span className="text-obsidian-700">|</span>

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
            onClick={() => setTitleEditing(true)}
            className="text-sm font-semibold text-obsidian-200 hover:text-obsidian-100 truncate max-w-xs"
          >
            {cv.title}
          </button>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => { setShowTemplates(!showTemplates); setShowCustomize(false) }} className={`btn-ghost py-1.5 px-3 text-xs ${showTemplates ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            <Layout size={13} />
            <span className="hidden md:inline">Templates</span>
          </button>
          <button onClick={() => { setShowCustomize(!showCustomize); setShowTemplates(false) }} className={`btn-ghost py-1.5 px-3 text-xs ${showCustomize ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            <Settings size={13} />
            <span className="hidden md:inline">Customize</span>
          </button>
          <button onClick={() => setPreviewMode(!previewMode)} className={`py-1.5 px-3 text-xs ${previewMode ? 'btn-primary' : 'btn-secondary'}`}>
            {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{previewMode ? 'Edit' : 'Preview'}</span>
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
        <div className={`${previewMode ? 'hidden md:block' : 'block'} h-full`}>
          <EditorSidebar cv={cv} cvId={id} activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>

        {/* Preview pane */}
        <div className={`${previewMode ? 'block' : 'hidden md:block'} flex-1 overflow-y-auto bg-obsidian-900/30 ${previewMode ? 'p-4 md:p-8' : 'p-4 md:p-8'}`}>
          <div className="flex justify-center">
            <CVPreview cv={cv} />
          </div>
        </div>
      </div>
    </div>
  )
}

function getPaymentProviderFromReturn(searchParams, data) {
  const provider = searchParams.get('provider') || searchParams.get('paymentProvider')
  const source = data?.entitlements?.find(e => e.source && e.source !== 'rewarded_ad')?.source
  return provider || source || 'paystack'
}
