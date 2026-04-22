import { useStore } from '../../../store/index.js'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function EntryCard({ entry, cvId, onRemove }) {
  const { updateExperience } = useStore()
  const [open, setOpen] = useState(true)
  const u = (f, v) => updateExperience(cvId, entry.id, f, v)

  return (
    <div className="entry-card">
      <div className="flex items-center justify-between cursor-pointer mb-0" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-obsidian-200 truncate">{entry.role || 'New Position'}</p>
          {entry.company && <p className="text-[10px] text-obsidian-500 truncate">{entry.company}</p>}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove() }} className="text-obsidian-600 hover:text-red-400 p-1 transition-colors">
            <Trash2 size={12} />
          </button>
          {open ? <ChevronUp size={13} className="text-obsidian-500" /> : <ChevronDown size={13} className="text-obsidian-500" />}
        </div>
      </div>

      {open && (
        <div className="space-y-2.5 mt-3 pt-3 border-t border-obsidian-700/50">
          <div>
            <label className="input-label">Job Title</label>
            <input className="input-field text-xs" value={entry.role} onChange={e => u('role', e.target.value)} placeholder="Senior Developer" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Company</label>
              <input className="input-field text-xs" value={entry.company} onChange={e => u('company', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="input-label">Location</label>
              <input className="input-field text-xs" value={entry.location} onChange={e => u('location', e.target.value)} placeholder="Remote" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Start Date</label>
              <input className="input-field text-xs" value={entry.startDate} onChange={e => u('startDate', e.target.value)} placeholder="Jan 2022" />
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input className="input-field text-xs" value={entry.endDate} onChange={e => u('endDate', e.target.value)} placeholder="Present" disabled={entry.current} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={entry.current} onChange={e => { u('current', e.target.checked); if (e.target.checked) u('endDate', 'Present') }} className="accent-amber-400" />
            <span className="text-[10px] text-obsidian-400">Currently working here</span>
          </label>
          <div>
            <label className="input-label">Description</label>
            <textarea
              className="input-field text-xs resize-none"
              rows={4}
              value={entry.description}
              onChange={e => u('description', e.target.value)}
              placeholder="• Led redesign of core product feature, improving engagement by 40%&#10;• Managed cross-functional team of 6 engineers"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExperienceSection({ cv, cvId }) {
  const { addExperience, removeExperience } = useStore()
  const entries = cv.sections.experience.data

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400">Experience</h2>
        <button onClick={() => addExperience(cvId)} className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-medium">
          <Plus size={12} /> Add
        </button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-obsidian-500 mb-3">No experience entries yet</p>
          <button onClick={() => addExperience(cvId)} className="btn-secondary py-1.5 px-4 text-xs">
            <Plus size={12} /> Add Experience
          </button>
        </div>
      )}

      {entries.map(entry => (
        <EntryCard
          key={entry.id}
          entry={entry}
          cvId={cvId}
          onRemove={() => removeExperience(cvId, entry.id)}
        />
      ))}
    </div>
  )
}
