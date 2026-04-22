import { useStore } from '../../../store/index.js'
import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const CATEGORIES = [
  { id: 'technical', label: 'Technical Skills', placeholder: 'React, TypeScript, Node.js...' },
  { id: 'soft', label: 'Soft Skills', placeholder: 'Leadership, Communication...' },
  { id: 'languages', label: 'Languages', placeholder: 'English (Native), Spanish...' },
]

function SkillChip({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-obsidian-800 border border-obsidian-700 text-xs text-obsidian-200">
      {skill}
      <button onClick={onRemove} className="text-obsidian-500 hover:text-red-400 transition-colors ml-0.5">
        <X size={10} />
      </button>
    </span>
  )
}

function SkillCategory({ category, skills, cvId }) {
  const { updateSkills } = useStore()
  const [input, setInput] = useState('')

  const addSkill = () => {
    const trimmed = input.trim()
    if (!trimmed || skills.includes(trimmed)) return
    updateSkills(cvId, category.id, [...skills, trimmed])
    setInput('')
  }

  const removeSkill = (skill) => {
    updateSkills(cvId, category.id, skills.filter(s => s !== skill))
  }

  return (
    <div className="space-y-2">
      <label className="input-label">{category.label}</label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {skills.map(s => (
          <SkillChip key={s} skill={s} onRemove={() => removeSkill(s)} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input-field text-xs flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          placeholder={category.placeholder}
        />
        <button onClick={addSkill} className="btn-ghost px-2 py-1.5">
          <Plus size={14} className="text-amber-400" />
        </button>
      </div>
    </div>
  )
}

export default function SkillsSection({ cv, cvId }) {
  const skills = cv.sections.skills.data

  return (
    <div className="space-y-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400 pb-2 border-b border-obsidian-800">Skills</h2>
      <p className="text-[10px] text-obsidian-500">Type a skill and press Enter to add it.</p>
      {CATEGORIES.map(cat => (
        <SkillCategory key={cat.id} category={cat} skills={skills[cat.id] || []} cvId={cvId} />
      ))}
    </div>
  )
}
