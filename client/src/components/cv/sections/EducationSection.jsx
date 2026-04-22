import { useStore } from '../../../store/index.js'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function EntryCard({ entry, cvId, onRemove }) {
  const { updateEducation } = useStore()
  const [open, setOpen] = useState(true)
  const u = (f, v) => updateEducation(cvId, entry.id, f, v)

  return (
    <div className="entry-card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-obsidian-200 truncate">{entry.degree || 'New Degree'}</p>
          {entry.school && <p className="text-[10px] text-obsidian-500 truncate">{entry.school}</p>}
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
            <label className="input-label">Degree / Qualification</label>
            <input className="input-field text-xs" value={entry.degree} onChange={e => u('degree', e.target.value)} placeholder="B.Sc. Computer Science" />
          </div>
          <div>
            <label className="input-label">School / University</label>
            <input className="input-field text-xs" value={entry.school} onChange={e => u('school', e.target.value)} placeholder="MIT" />
          </div>
          <div>
            <label className="input-label">Field of Study</label>
            <input className="input-field text-xs" value={entry.field} onChange={e => u('field', e.target.value)} placeholder="Software Engineering" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Start Year</label>
              <input className="input-field text-xs" value={entry.startDate} onChange={e => u('startDate', e.target.value)} placeholder="2018" />
            </div>
            <div>
              <label className="input-label">End Year</label>
              <input className="input-field text-xs" value={entry.endDate} onChange={e => u('endDate', e.target.value)} placeholder="2022" />
            </div>
          </div>
          <div>
            <label className="input-label">Grade / GPA (optional)</label>
            <input className="input-field text-xs" value={entry.grade} onChange={e => u('grade', e.target.value)} placeholder="3.9 / 4.0" />
          </div>
          <div>
            <label className="input-label">Notes (optional)</label>
            <textarea className="input-field text-xs resize-none" rows={3} value={entry.description} onChange={e => u('description', e.target.value)} placeholder="Relevant coursework, thesis, honors..." />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EducationSection({ cv, cvId }) {
  const { addEducation, removeEducation } = useStore()
  const entries = cv.sections.education.data

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400">Education</h2>
        <button onClick={() => addEducation(cvId)} className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-medium">
          <Plus size={12} /> Add
        </button>
      </div>
      {entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-obsidian-500 mb-3">No education entries yet</p>
          <button onClick={() => addEducation(cvId)} className="btn-secondary py-1.5 px-4 text-xs"><Plus size={12} /> Add Education</button>
        </div>
      )}
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} cvId={cvId} onRemove={() => removeEducation(cvId, entry.id)} />
      ))}
    </div>
  )
}
