import { useStore } from '../../../store/index.js'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function EntryCard({ entry, cvId, onRemove }) {
  const { updateProject } = useStore()
  const [open, setOpen] = useState(true)
  const u = (f, v) => updateProject(cvId, entry.id, f, v)

  return (
    <div className="entry-card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-obsidian-200 truncate">{entry.name || 'New Project'}</p>
          {entry.technologies && <p className="text-[10px] text-obsidian-500 truncate">{entry.technologies}</p>}
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
            <label className="input-label">Project Name</label>
            <input className="input-field text-xs" value={entry.name} onChange={e => u('name', e.target.value)} placeholder="Portfolio Website" />
          </div>
          <div>
            <label className="input-label">Your Role</label>
            <input className="input-field text-xs" value={entry.role} onChange={e => u('role', e.target.value)} placeholder="Lead Developer" />
          </div>
          <div>
            <label className="input-label">Technologies</label>
            <input className="input-field text-xs" value={entry.technologies} onChange={e => u('technologies', e.target.value)} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Start</label>
              <input className="input-field text-xs" value={entry.startDate} onChange={e => u('startDate', e.target.value)} placeholder="Jan 2023" />
            </div>
            <div>
              <label className="input-label">End</label>
              <input className="input-field text-xs" value={entry.endDate} onChange={e => u('endDate', e.target.value)} placeholder="Mar 2023" />
            </div>
          </div>
          <div>
            <label className="input-label">Project URL (optional)</label>
            <input className="input-field text-xs" value={entry.url} onChange={e => u('url', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="input-label">Description</label>
            <textarea className="input-field text-xs resize-none" rows={3} value={entry.description} onChange={e => u('description', e.target.value)} placeholder="What it does, key achievements, impact..." />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsSection({ cv, cvId }) {
  const { addProject, removeProject } = useStore()
  const entries = cv.sections.projects.data

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
        <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400">Projects</h2>
        <button onClick={() => addProject(cvId)} className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-medium">
          <Plus size={12} /> Add
        </button>
      </div>
      {entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-obsidian-500 mb-3">Showcase your work</p>
          <button onClick={() => addProject(cvId)} className="btn-secondary py-1.5 px-4 text-xs"><Plus size={12} /> Add Project</button>
        </div>
      )}
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} cvId={cvId} onRemove={() => removeProject(cvId, entry.id)} />
      ))}
    </div>
  )
}
