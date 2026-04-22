import { useParams, useNavigate } from 'react-router-dom'
import { useStore, selectActiveCV } from '../store/index.js'
import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Eye, EyeOff, Layout, Download, ChevronRight, Settings } from 'lucide-react'

import EditorSidebar from '../components/cv/EditorSidebar.jsx'
import CVPreview from '../components/cv/CVPreview.jsx'
import TemplateSelector from '../components/cv/TemplateSelector.jsx'
import CustomizationPanel from '../components/cv/CustomizationPanel.jsx'
import ExportMenu from '../components/cv/ExportMenu.jsx'

export default function CVBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setActiveCV, updateCV } = useStore()
  const cv = useStore(s => s.cvs.find(c => c.id === id))
  const activeSection = useStore(s => s.activeSection)
  const setActiveSection = useStore(s => s.setActiveSection)

  const [previewMode, setPreviewMode] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [titleEditing, setTitleEditing] = useState(false)

  useEffect(() => {
    if (!cv) { navigate('/dashboard'); return }
    setActiveCV(id)
  }, [id])

  const handleTitleChange = useCallback((e) => {
    updateCV(id, c => ({ ...c, title: e.target.value }))
  }, [id])

  if (!cv) return null

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
          <button onClick={() => setTitleEditing(true)} className="text-sm font-semibold text-obsidian-200 hover:text-obsidian-100 truncate max-w-xs">
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
        {!previewMode && (
          <EditorSidebar cv={cv} cvId={id} activeSection={activeSection} setActiveSection={setActiveSection} />
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
