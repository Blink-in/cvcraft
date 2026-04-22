import { useStore } from '../../store/index.js'
import { X } from 'lucide-react'

const FONTS = ['DM Sans', 'Georgia', 'Helvetica', 'Garamond', 'Palatino']
const FONT_SIZES = [
  { id: 'sm', label: 'Small' },
  { id: 'md', label: 'Medium' },
  { id: 'lg', label: 'Large' },
]
const SPACINGS = [
  { id: 'compact', label: 'Compact' },
  { id: 'normal', label: 'Normal' },
  { id: 'relaxed', label: 'Relaxed' },
]

const PRESET_ACCENTS = [
  '#c9a84c', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#f97316', '#06b6d4', '#1a1814',
]
const PRESET_PRIMARY = [
  '#1a1814', '#0f172a', '#1e293b', '#1a0a2e', '#0a1628', '#1a2744', '#0d1f0d', '#2d1515',
]

export default function CustomizationPanel({ cvId, cv, onClose }) {
  const { updateCustomization } = useStore()
  const custom = cv.customization || {}
  const upd = (f, v) => updateCustomization(cvId, f, v)

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end pt-14">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-[calc(100vh-56px)] w-80 bg-obsidian-900 border-l border-obsidian-700 overflow-y-auto z-10 animate-slide-right">
        <div className="flex items-center justify-between p-4 border-b border-obsidian-800">
          <h2 className="font-semibold text-sm">Customization</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
        </div>

        <div className="p-4 space-y-6">
          {/* Primary Color */}
          <div>
            <label className="input-label">Primary Color (Header)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_PRIMARY.map(color => (
                <button
                  key={color}
                  onClick={() => upd('primaryColor', color)}
                  className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${custom.primaryColor === color ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={custom.primaryColor || '#1a1814'} onChange={e => upd('primaryColor', e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent" />
              <input type="text" value={custom.primaryColor || '#1a1814'} onChange={e => upd('primaryColor', e.target.value)} className="input-field text-xs font-mono flex-1" placeholder="#1a1814" />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="input-label">Accent Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_ACCENTS.map(color => (
                <button
                  key={color}
                  onClick={() => upd('accentColor', color)}
                  className={`w-7 h-7 rounded-md border-2 transition-transform hover:scale-110 ${custom.accentColor === color ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={custom.accentColor || '#c9a84c'} onChange={e => upd('accentColor', e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent" />
              <input type="text" value={custom.accentColor || '#c9a84c'} onChange={e => upd('accentColor', e.target.value)} className="input-field text-xs font-mono flex-1" placeholder="#c9a84c" />
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="input-label">Font Family</label>
            <div className="space-y-1.5">
              {FONTS.map(f => (
                <button
                  key={f}
                  onClick={() => upd('fontFamily', f)}
                  className={`w-full px-3 py-2 rounded-lg border text-left text-sm transition-all ${
                    custom.fontFamily === f ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-obsidian-700 text-obsidian-300 hover:border-obsidian-600'
                  }`}
                  style={{ fontFamily: f }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="input-label">Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => upd('fontSize', s.id)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                    custom.fontSize === s.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-obsidian-700 text-obsidian-400 hover:border-obsidian-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div>
            <label className="input-label">Line Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {SPACINGS.map(s => (
                <button
                  key={s.id}
                  onClick={() => upd('spacing', s.id)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                    custom.spacing === s.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-obsidian-700 text-obsidian-400 hover:border-obsidian-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
