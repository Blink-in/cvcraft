import { useStore } from '../../store/index.js'
import { X, Check } from 'lucide-react'

const TEMPLATES = [
  { id: 'classic', name: 'Classic', desc: 'Gold-accented, two-column', colors: ['#1a1814', '#c9a84c', '#faf8f3'] },
  { id: 'modern', name: 'Modern', desc: 'Navy blue, contemporary', colors: ['#0f172a', '#3b82f6', '#f8fafc'] },
  { id: 'minimal', name: 'Minimal', desc: 'Pure type, no distractions', colors: ['#ffffff', '#1a1814', '#e5e0d6'] },
  { id: 'executive', name: 'Executive', desc: 'Slate, senior-level gravitas', colors: ['#1e293b', '#94a3b8', '#f1f5f9'] },
  { id: 'creative', name: 'Creative', desc: 'Purple diagonal, bold', colors: ['#1a0a2e', '#a855f7', '#faf5ff'] },
  { id: 'elegant', name: 'Elegant', desc: 'Sophisticated serif, luxurious feel', colors: ['#2d2d2d', '#8b7355', '#fdf6e3'] },
  { id: 'professional', name: 'Professional', desc: 'Clean corporate, trusted standard', colors: ['#1565c0', '#42a5f5', '#ffffff'] },
]

export default function TemplateSelector({ cvId, cv, onClose }) {
  const { changeTemplate } = useStore()

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-2xl p-6 z-10 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold">Choose Template</h2>
            <p className="text-xs text-obsidian-500 mt-0.5">Switch anytime — your data is preserved</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {TEMPLATES.map(tpl => {
            const isActive = cv.template === tpl.id
            return (
              <button
                key={tpl.id}
                onClick={() => { changeTemplate(cvId, tpl.id); onClose() }}
                className={`group relative rounded-xl border-2 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive ? 'border-amber-500 bg-amber-500/5' : 'border-obsidian-700 hover:border-obsidian-500'
                }`}
              >
                {/* Mini preview */}
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-2.5" style={{ background: tpl.colors[0] }}>
                  <div className="p-2 h-full flex flex-col gap-1">
                    <div className="h-3 rounded" style={{ background: tpl.colors[1], opacity: 0.9 }} />
                    <div className="h-1 rounded w-4/5" style={{ background: tpl.colors[2], opacity: 0.4 }} />
                    <div className="flex gap-1 mt-1 flex-1">
                      <div className="flex-1 space-y-0.5">
                        {[0.9, 0.7, 0.8, 0.6, 0.9, 0.5, 0.7, 0.8].map((w, i) => (
                          <div key={i} className="h-0.5 rounded" style={{ width: `${w * 100}%`, background: tpl.colors[2], opacity: 0.3 }} />
                        ))}
                      </div>
                      <div className="w-8 space-y-0.5">
                        {[0.8, 0.6, 0.9, 0.7, 0.5].map((w, i) => (
                          <div key={i} className="h-0.5 rounded" style={{ width: `${w * 100}%`, background: tpl.colors[2], opacity: 0.2 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-obsidian-100">{tpl.name}</p>
                <p className="text-[9px] text-obsidian-500 mt-0.5 leading-tight">{tpl.desc}</p>

                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check size={11} className="text-obsidian-950" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
