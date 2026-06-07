import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/index.js'
import { Plus, FileText, Copy, Trash2, Clock, Download, Upload, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react'
import { formatDistanceToNow } from '../utils/date.js'
import { downloadJSON, importJSON } from '../utils/io.js'
import { useRef } from 'react'

function EmptyState({ onAction, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-obsidian-700 rounded-xl text-center">
      <div className="w-12 h-12 rounded-full bg-obsidian-800 flex items-center justify-center mb-4">
        <Icon size={22} className="text-obsidian-500" />
      </div>
      <p className="text-obsidian-400 mb-4 text-sm">No documents yet</p>
      <button onClick={onAction} className="btn-primary py-2 px-5 text-sm">
        <Plus size={15} />
        {label}
      </button>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const fileRef = useRef()
  const {
    cvs, coverLetters,
    createCV, duplicateCV, deleteCV,
    createCoverLetter, duplicateCoverLetter, deleteCoverLetter,
    exportData, importData,
  } = useStore()

  const handleNewCV = () => {
    const cv = createCV({ title: 'My CV' })
    navigate(`/cv/${cv.id}`)
  }

  const handleNewCL = () => {
    const cl = createCoverLetter({ title: 'My Cover Letter' })
    navigate(`/cover-letter/${cl.id}`)
  }

  const handleExport = () => {
    const json = exportData()
    downloadJSON(json, 'cvcraft-backup.json')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const success = importData(ev.target.result)
      alert(success ? '✓ Data imported successfully!' : '✗ Invalid file format.')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-obsidian-950 font-body">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 border-b border-obsidian-900 bg-obsidian-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="btn-ghost py-1.5 px-3 text-xs">
            <ArrowLeft size={14} />
            Home
          </button>
          <span className="text-obsidian-600">|</span>
          <span className="font-display text-lg font-bold">
            CV<span className="text-gradient">Craft</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary py-2 px-3 text-xs">
            <Download size={13} />
            Export Backup
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary py-2 px-3 text-xs">
            <Upload size={13} />
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Page title ── */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-obsidian-400 text-sm">All your documents, saved right in your browser.</p>
        </div>

        {/* ── CVs ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-amber-400" />
              <h2 className="font-semibold text-lg text-obsidian-100">CVs</h2>
              <span className="text-xs bg-obsidian-800 border border-obsidian-700 rounded-full px-2 py-0.5 text-obsidian-400">
                {cvs.length}
              </span>
            </div>
            <button onClick={handleNewCV} className="btn-primary py-2 px-4 text-sm">
              <Plus size={15} />
              New CV
            </button>
          </div>

          {cvs.length === 0 ? (
            <EmptyState onAction={handleNewCV} label="Create Your First CV" icon={FileText} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvs.map(cv => (
                <div
                  key={cv.id}
                  className="group card p-5 hover:border-obsidian-600 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                  onClick={() => navigate(`/cv/${cv.id}`)}
                >
                  {/* Template color stripe */}
                  <div className="h-1.5 w-full rounded-full mb-4 opacity-70" style={{ background: TEMPLATE_COLORS[cv.template] || '#c9a84c' }} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-obsidian-100 truncate mb-1">{cv.title}</h3>
                      <span className="inline-block text-xs px-2 py-0.5 rounded bg-obsidian-800 text-obsidian-400 border border-obsidian-700 capitalize">
                        {cv.template} template
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {cv.monetization?.downloadUnlocked ? (
                          <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            <ShieldCheck size={10} />
                            Download paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                            Preview only
                          </span>
                        )}
                        {cv.monetization?.downloadedAt && !cv.monetization?.editUnlocked && (
                          <span className="inline-flex items-center gap-1 rounded border border-obsidian-700 bg-obsidian-800 px-2 py-0.5 text-[10px] font-medium text-obsidian-300">
                            <Lock size={10} />
                            Edit locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-obsidian-600 mb-4">
                    <Clock size={11} />
                    {formatDistanceToNow(cv.updatedAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/cv/${cv.id}`)}
                      className="flex-1 btn-secondary py-1.5 text-xs justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => duplicateCV(cv.id)}
                      className="btn-ghost py-1.5 px-2"
                      title="Duplicate"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this CV?')) deleteCV(cv.id) }}
                      className="btn-danger py-1.5 px-2"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Cover Letters ── */}
        {/* TEMPORARILY DISABLED - TO BE FIXED LATER
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-amber-400" />
              <h2 className="font-semibold text-lg text-obsidian-100">Cover Letters</h2>
              <span className="text-xs bg-obsidian-800 border border-obsidian-700 rounded-full px-2 py-0.5 text-obsidian-400">
                {coverLetters.length}
              </span>
            </div>
            <button onClick={handleNewCL} className="btn-primary py-2 px-4 text-sm opacity-50 cursor-not-allowed" disabled>
              <Plus size={15} />
              New Cover Letter
            </button>
          </div>

          {coverLetters.length === 0 ? (
            <EmptyState onAction={() => {}} label="Create Your First Cover Letter" icon={Mail} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coverLetters.map(cl => (
                <div
                  key={cl.id}
                  className="group card p-5 hover:border-obsidian-600 transition-all duration-200 cursor-not-allowed opacity-50"
                >
                  <div className="h-1.5 w-full rounded-full mb-4 opacity-70 bg-amber-500" />
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-obsidian-100 truncate mb-1">{cl.title}</h3>
                      {cl.company && (
                        <p className="text-xs text-obsidian-400 truncate">{cl.jobTitle} @ {cl.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-obsidian-600 mb-4">
                    <Clock size={11} />
                    {formatDistanceToNow(cl.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      className="flex-1 btn-secondary py-1.5 text-xs justify-center opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Edit
                    </button>
                    <button className="btn-ghost py-1.5 px-2 opacity-50 cursor-not-allowed" disabled>
                      <Copy size={13} />
                    </button>
                    <button className="btn-danger py-1.5 px-2 opacity-50 cursor-not-allowed" disabled>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        END TEMPORARILY DISABLED */}
      </main>
    </div>
  )
}

const TEMPLATE_COLORS = {
  classic: '#c9a84c',
  modern: '#3b82f6',
  minimal: '#94a3b8',
  executive: '#64748b',
  creative: '#a855f7',
  elegant: '#8b7355',
  professional: '#42a5f5',
}
