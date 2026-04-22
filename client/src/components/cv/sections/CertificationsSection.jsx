import { useStore } from '../../../store/index.js'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function EntryCard({ entry, cvId, onRemove }) {
  const { updateCertification } = useStore()
  const [open, setOpen] = useState(true)
  const u = (f, v) => updateCertification(cvId, entry.id, f, v)

  return (
    <div className="entry-card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-obsidian-200 truncate">{entry.name || 'New Certification'}</p>
          {entry.issuer && <p className="text-[10px] text-obsidian-500 truncate">{entry.issuer}</p>}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={e => { e.stopPropagation(); onRemove() }} className="text-obsidian-600 hover:text-red-400 p-1 transition-colors">
            <Trash2 size={12} />
          </button>
          {open ? <ChevronUp size={13} className="text-obsidian-500" /> : <ChevronDown size={13} className="text-obsidian-500" />}
        </div>
      </div>
      {open && (
        <div className="space-y-2.5 mt-3 pt-3 border-t border-obsidian-700/50">
          <div>
            <label className="input-label">Certification Name</label>
            <input className="input-field text-xs" value={entry.name} onChange={e => u('name', e.target.value)} placeholder="AWS Solutions Architect" />
          </div>
          <div>
            <label className="input-label">Issuing Organization</label>
            <input className="input-field text-xs" value={entry.issuer} onChange={e => u('issuer', e.target.value)} placeholder="Amazon Web Services" />
          </div>
          <div>
            <label className="input-label">Date Issued</label>
            <input className="input-field text-xs" value={entry.date} onChange={e => u('date', e.target.value)} placeholder="March 2024" />
          </div>
          <div>
            <label className="input-label">Credential URL (optional)</label>
            <input className="input-field text-xs" value={entry.url} onChange={e => u('url', e.target.value)} placeholder="https://credential.net/..." />
          </div>
        </div>
      )}
    </div>
  )
}

export default function CertificationsSection({ cv, cvId }) {
  const { addCertification, removeCertification } = useStore()
  const entries = cv.sections.certifications.data

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400">Certifications</h2>
        <button onClick={() => addCertification(cvId)} className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-medium">
          <Plus size={12} /> Add
        </button>
      </div>
      {entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-obsidian-500 mb-3">Add your credentials</p>
          <button onClick={() => addCertification(cvId)} className="btn-secondary py-1.5 px-4 text-xs"><Plus size={12} /> Add Certification</button>
        </div>
      )}
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} cvId={cvId} onRemove={() => removeCertification(cvId, entry.id)} />
      ))}
    </div>
  )
}
