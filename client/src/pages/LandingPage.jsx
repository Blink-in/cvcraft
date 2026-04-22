import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/index.js'
import { ArrowRight, FileText, Sparkles, Download, Layers, Zap, Star, ChevronRight } from 'lucide-react'

const TEMPLATES = [
  { id: 'classic', name: 'Classic', desc: 'Timeless two-column elegance', color: '#1a1814', accent: '#c9a84c' },
  { id: 'modern', name: 'Modern', desc: 'Clean lines, bold identity', color: '#0f172a', accent: '#3b82f6' },
  { id: 'minimal', name: 'Minimal', desc: 'Pure whitespace, refined type', color: '#ffffff', accent: '#1a1814' },
  { id: 'executive', name: 'Executive', desc: 'Senior-level gravitas', color: '#1e293b', accent: '#94a3b8' },
  { id: 'creative', name: 'Creative', desc: 'Stand out, break rules', color: '#1a0a2e', accent: '#a855f7' },
]

const FEATURES = [
  { icon: Zap, title: 'Instant Start', desc: 'No signup, no friction. Open the editor and start building your CV in seconds.' },
  { icon: Layers, title: '5+ Templates', desc: 'Professionally designed layouts for every industry and seniority level.' },
  { icon: Sparkles, title: 'AI Cover Letters', desc: 'Claude-powered cover letters tailored to each job description in seconds.' },
  { icon: Download, title: 'PDF & DOCX Export', desc: 'High-fidelity exports that look perfect whether printed or sent digitally.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const createCV = useStore(s => s.createCV)

  const handleStart = () => {
    const cv = createCV({ title: 'My CV' })
    navigate(`/cv/${cv.id}`)
  }

  return (
    <div className="min-h-screen bg-obsidian-950 font-body overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/5 bg-obsidian-950/80 backdrop-blur-xl">
        <span className="font-display text-xl font-bold tracking-tight">
          CV<span className="text-gradient">Craft</span>
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm hidden md:flex">
            Dashboard
          </button>
          <button onClick={handleStart} className="btn-primary text-sm py-2 px-4">
            Start Building
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium tracking-wider uppercase mb-8 animate-fade-in">
            <Sparkles size={12} />
            AI-Powered · No Signup Required
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-6 stagger-child">
            Build CVs That<br />
            <span className="text-gradient">Get Interviews</span>
          </h1>

          <p className="text-obsidian-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed stagger-child" style={{ animationDelay: '0.1s' }}>
            Professional CV builder with AI-powered cover letters. 
            Five stunning templates. Instant PDF export. Zero friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 stagger-child" style={{ animationDelay: '0.2s' }}>
            <button onClick={handleStart} className="btn-primary text-base py-3 px-8 glow-gold">
              Start for Free
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary text-base py-3 px-8">
              View Dashboard
            </button>
          </div>

          <p className="mt-5 text-xs text-obsidian-600 stagger-child" style={{ animationDelay: '0.3s' }}>
            No account required · Data stays in your browser · Export anytime
          </p>
        </div>
      </section>

      {/* ── Template Showcase ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Templates for <span className="text-gradient">Every Career</span>
            </h2>
            <p className="text-obsidian-400 text-lg">Designed by professionals. Loved by recruiters.</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 justify-center flex-wrap">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => { const cv = createCV({ template: tpl.id, title: `${tpl.name} CV` }); navigate(`/cv/${cv.id}`) }}
                className="group cursor-pointer flex-shrink-0 w-44"
              >
                {/* Template thumbnail */}
                <div
                  className="w-full aspect-[3/4] rounded-xl border border-obsidian-700 overflow-hidden relative mb-3 transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-xl group-hover:shadow-amber-500/10 group-hover:-translate-y-1"
                  style={{ background: tpl.color }}
                >
                  {/* Simulated CV layout */}
                  <div className="p-3 h-full flex flex-col gap-1.5">
                    <div className="h-6 rounded" style={{ background: tpl.accent, opacity: 0.9 }} />
                    <div className="h-1.5 bg-white/20 rounded w-3/4 mt-0.5" />
                    <div className="h-px bg-white/10 mt-1" />
                    <div className="flex gap-1.5 mt-1">
                      <div className="flex-1 space-y-1">
                        {[1,0.7,0.8,0.6,0.9,0.5,0.7].map((w, i) => (
                          <div key={i} className="h-1 bg-white/15 rounded" style={{ width: `${w * 100}%` }} />
                        ))}
                      </div>
                      <div className="w-14 space-y-1">
                        {[0.8,0.6,0.9,0.7].map((w, i) => (
                          <div key={i} className="h-1 bg-white/10 rounded" style={{ width: `${w * 100}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm rounded-xl">
                    <span className="text-white text-xs font-semibold tracking-wide flex items-center gap-1.5">
                      Use Template <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-obsidian-100">{tpl.name}</p>
                  <p className="text-xs text-obsidian-500 mt-0.5">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 border-t border-obsidian-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything You <span className="text-gradient">Need</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:border-obsidian-700 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-obsidian-100 mb-2">{title}</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
            <span className="ml-2 text-sm text-obsidian-400">Loved by thousands of job seekers</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Your dream job is<br /><span className="text-gradient">one CV away</span>
          </h2>
          <button onClick={handleStart} className="btn-primary text-base py-3.5 px-10 glow-gold">
            Build My CV Now
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-obsidian-900 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-gradient">CVCraft</span>
          <p className="text-xs text-obsidian-600">Built with React + Node.js · No data leaves your browser without permission</p>
        </div>
      </footer>
    </div>
  )
}
