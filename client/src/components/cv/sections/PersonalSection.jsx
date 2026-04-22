import { useStore } from '../../../store/index.js'
import { useRef } from 'react'
import { Upload, X } from 'lucide-react'

export default function PersonalSection({ cv, cvId }) {
  const { updatePersonal } = useStore()
  const p = cv.sections.personal.data
  const fileRef = useRef()

  const update = (field, value) => updatePersonal(cvId, field, value)

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-obsidian-400 pb-2 border-b border-obsidian-800">
        Personal Info
      </h2>

      {/* Photo upload */}
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-full bg-obsidian-800 border-2 border-dashed border-obsidian-600 flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors overflow-hidden flex-shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          {p.photo ? (
            <img src={p.photo} className="w-full h-full object-cover" alt="profile" />
          ) : (
            <Upload size={16} className="text-obsidian-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-obsidian-300 font-medium">Profile Photo</p>
          <p className="text-[10px] text-obsidian-500 mt-0.5">Optional · JPG or PNG</p>
          <div className="flex gap-2 mt-1">
            <button onClick={() => fileRef.current?.click()} className="text-[10px] text-amber-400 hover:underline">Upload</button>
            {p.photo && <button onClick={() => update('photo', null)} className="text-[10px] text-red-400 hover:underline">Remove</button>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      <div>
        <label className="input-label">Full Name</label>
        <input className="input-field" value={p.name} onChange={e => update('name', e.target.value)} placeholder="Alexandra Chen" />
      </div>

      <div>
        <label className="input-label">Job Title</label>
        <input className="input-field" value={p.title} onChange={e => update('title', e.target.value)} placeholder="Senior Product Designer" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="input-label">Email</label>
          <input className="input-field text-xs" value={p.email} onChange={e => update('email', e.target.value)} placeholder="alex@email.com" type="email" />
        </div>
        <div>
          <label className="input-label">Phone</label>
          <input className="input-field text-xs" value={p.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 555 012 3456" />
        </div>
      </div>

      <div>
        <label className="input-label">Location</label>
        <input className="input-field" value={p.location} onChange={e => update('location', e.target.value)} placeholder="San Francisco, CA" />
      </div>

      <div>
        <label className="input-label">LinkedIn URL</label>
        <input className="input-field text-xs" value={p.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/alexchen" />
      </div>

      <div>
        <label className="input-label">Website / Portfolio</label>
        <input className="input-field text-xs" value={p.website} onChange={e => update('website', e.target.value)} placeholder="alexchen.design" />
      </div>

      <div>
        <label className="input-label">Professional Summary</label>
        <textarea
          className="input-field resize-none text-xs"
          rows={5}
          value={p.summary}
          onChange={e => update('summary', e.target.value)}
          placeholder="Write a compelling 2–3 sentence summary that captures your expertise and unique value..."
        />
      </div>
    </div>
  )
}
