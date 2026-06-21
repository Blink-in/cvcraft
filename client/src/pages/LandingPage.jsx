import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/index.js'
import {
  ArrowRight, CheckCircle2, ChevronRight, Download, Layers, Search,
  Sparkles, Star, Target, Zap,
} from 'lucide-react'

const TEMPLATES = [
  { id: 'classic', name: 'Classic', desc: 'Timeless two-column elegance', color: '#1a1814', accent: '#c9a84c' },
  { id: 'modern', name: 'Modern', desc: 'Clean lines, bold identity', color: '#0f172a', accent: '#3b82f6' },
  { id: 'minimal', name: 'Minimal', desc: 'Pure whitespace, refined type', color: '#ffffff', accent: '#1a1814' },
  { id: 'executive', name: 'Executive', desc: 'Senior-level gravitas', color: '#1e293b', accent: '#94a3b8' },
  { id: 'creative', name: 'Creative', desc: 'Stand out with personality', color: '#1a0a2e', accent: '#a855f7' },
  { id: 'cleanFlow', name: 'Clean Flow', desc: 'Simple ATS clarity', color: '#ffffff', accent: '#2d3338' },
  { id: 'timelessSleek', name: 'Timeless Sleek', desc: 'Editorial polish', color: '#b7a29b', accent: '#ffffff' },
  { id: 'modernOverlay', name: 'Modern Overlay', desc: 'Framed two-column impact', color: '#546874', accent: '#ffffff' },
]

const FEATURES = [
  { icon: Zap, title: 'Instant Start', desc: 'No signup, no friction. Open the CV editor and start building in seconds.' },
  { icon: Layers, title: '11 Templates', desc: 'Professionally designed CV layouts for different industries and seniority levels.' },
  { icon: Sparkles, title: 'AI Cover Letters', desc: 'Create cover letters tailored to job descriptions and applications.' },
  { icon: Download, title: 'PDF Export', desc: 'Export a polished CV that looks sharp when printed or sent digitally.' },
]

const SEO_TOPICS = [
  { icon: Search, title: 'Built for CV searches', desc: 'CVCraft focuses on helping people create a clear, professional CV online without fighting document formatting.' },
  { icon: Target, title: 'ATS-friendly structure', desc: 'Templates use standard sections, readable typography, and recruiter-friendly layouts that are easier to scan.' },
  { icon: CheckCircle2, title: 'Practical CV guidance', desc: 'The builder pairs templates with CV writing advice, examples, and reminders for stronger applications.' },
]

const CV_STEPS = [
  'Pick an ATS-friendly CV template that matches your career level.',
  'Add your work experience, education, skills, projects, and certifications.',
  'Preview your CV live, adjust spacing and colors, then export when ready.',
]

const FAQS = [
  {
    q: 'What is a CV builder?',
    a: 'A CV builder is an online tool that helps you create a curriculum vitae by filling in structured sections such as profile, work experience, education, skills, and projects.',
  },
  {
    q: 'Can I make a CV for free?',
    a: 'Yes. CVCraft lets you start a CV for free, choose a professional template, preview your document, and keep your work saved in your browser.',
  },
  {
    q: 'Are the CV templates ATS-friendly?',
    a: 'CVCraft templates are designed with standard headings, readable spacing, and clean layouts so applicant tracking systems and recruiters can understand your CV.',
  },
  {
    q: 'What should I include in a CV?',
    a: 'Most CVs should include contact details, a short professional summary, work experience, education, relevant skills, certifications, and selected projects.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const createCV = useStore(s => s.createCV)

  const handleStart = () => {
    const cv = createCV({ title: 'My CV' })
    navigate(`/cv/${cv.id}`)
  }

  const startWithTemplate = (tpl) => {
    const cv = createCV({ template: tpl.id, title: `${tpl.name} CV` })
    navigate(`/cv/${cv.id}`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian-950 font-body">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-obsidian-950/80 px-6 backdrop-blur-xl md:px-12">
        <button onClick={() => navigate('/')} className="font-display text-xl font-bold tracking-tight">
          CV<span className="text-gradient">Craft</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/cv-writing-guide')} className="btn-ghost hidden text-sm md:flex">
            CV Guide
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost hidden text-sm md:flex">
            Dashboard
          </button>
          <button onClick={handleStart} className="btn-primary px-4 py-2 text-sm">
            Start Building
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute left-1/4 top-20 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute right-1/4 top-40 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-400">
            <Sparkles size={12} />
            AI-powered CV builder · No signup required
          </div>

          <h1 className="stagger-child mb-6 font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
            Free CV Builder<br />
            <span className="text-gradient">Create a Professional CV Online</span>
          </h1>

          <p className="stagger-child mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-obsidian-400 md:text-xl" style={{ animationDelay: '0.1s' }}>
            Make a polished CV online with ATS-friendly templates, live preview, practical CV writing guidance,
            and PDF export. CVCraft is built for job seekers who want a simple CV maker without signup friction.
          </p>

          <div className="stagger-child flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.2s' }}>
            <button onClick={handleStart} className="btn-primary glow-gold px-8 py-3 text-base">
              Start My CV Free
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/cv-writing-guide')} className="btn-secondary px-8 py-3 text-base">
              Read CV Guide
            </button>
          </div>

          <p className="stagger-child mt-5 text-xs text-obsidian-600" style={{ animationDelay: '0.3s' }}>
            No account required · Data stays in your browser · Export when ready
          </p>
        </div>
      </section>

      <section className="border-y border-obsidian-900 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">Online CV Maker</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-obsidian-100 md:text-4xl">
              Create a CV that is easy to read, easy to edit, and ready to send.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-obsidian-400">
              CVCraft helps you turn career details into a professional curriculum vitae. Use it as a free CV
              builder for job applications, internships, graduate roles, remote jobs, freelance proposals, and
              career changes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {SEO_TOPICS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-obsidian-800 bg-obsidian-900/60 p-5">
                <Icon size={18} className="mb-3 text-amber-400" />
                <h3 className="text-sm font-semibold text-obsidian-100">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-obsidian-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Free CV Templates for <span className="text-gradient">Every Career</span>
            </h2>
            <p className="text-lg text-obsidian-400">Choose a professional CV template, customize it, and keep your layout consistent.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {TEMPLATES.map((tpl) => (
              <button key={tpl.id} onClick={() => startWithTemplate(tpl)} className="group w-44 flex-shrink-0 text-left">
                <div
                  className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-lg border border-obsidian-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-500/40 group-hover:shadow-xl group-hover:shadow-amber-500/10"
                  style={{ background: tpl.color }}
                >
                  <div className="flex h-full flex-col gap-1.5 p-3">
                    <div className="h-6 rounded" style={{ background: tpl.accent, opacity: 0.9 }} />
                    <div className="mt-0.5 h-1.5 w-3/4 rounded bg-white/20" />
                    <div className="mt-1 h-px bg-white/10" />
                    <div className="mt-1 flex gap-1.5">
                      <div className="flex-1 space-y-1">
                        {[1, 0.7, 0.8, 0.6, 0.9, 0.5, 0.7].map((w, i) => (
                          <div key={i} className="h-1 rounded bg-white/15" style={{ width: `${w * 100}%` }} />
                        ))}
                      </div>
                      <div className="w-14 space-y-1">
                        {[0.8, 0.6, 0.9, 0.7].map((w, i) => (
                          <div key={i} className="h-1 rounded bg-white/10" style={{ width: `${w * 100}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white">
                      Use Template <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-obsidian-100">{tpl.name}</p>
                  <p className="mt-0.5 text-xs text-obsidian-500">{tpl.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-obsidian-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">How to make a CV online</p>
            <h2 className="font-display text-4xl font-bold text-obsidian-100">A faster way to write a professional CV</h2>
            <p className="mt-4 text-sm leading-relaxed text-obsidian-400">
              Start with structure instead of a blank document. CVCraft keeps the design work handled while you focus
              on achievements, skills, and the details employers need to evaluate your application.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {CV_STEPS.map((step, index) => (
              <div key={step} className="rounded-lg border border-obsidian-800 bg-obsidian-900/60 p-6">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-obsidian-950">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-obsidian-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-obsidian-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Everything You <span className="text-gradient">Need</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-obsidian-700">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                  <Icon size={18} className="text-amber-400" />
                </div>
                <h3 className="mb-2 font-semibold text-obsidian-100">{title}</h3>
                <p className="text-sm leading-relaxed text-obsidian-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-obsidian-900 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-obsidian-100">CV Builder Questions</h2>
            <p className="mt-3 text-sm text-obsidian-400">Clear answers for people creating a CV online.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQS.map(item => (
              <div key={item.q} className="rounded-lg border border-obsidian-800 bg-obsidian-900/60 p-5">
                <h3 className="text-sm font-semibold text-obsidian-100">{item.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-obsidian-400">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/cv-writing-guide')} className="btn-secondary px-6 py-2.5 text-sm">
              Read the CV writing guide
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
            <span className="ml-2 text-sm text-obsidian-400">Built for job seekers worldwide</span>
          </div>
          <h2 className="mb-6 font-display text-4xl font-bold md:text-5xl">
            Your next application starts<br /><span className="text-gradient">with a stronger CV</span>
          </h2>
          <button onClick={handleStart} className="btn-primary glow-gold px-10 py-3.5 text-base">
            Build My CV Now
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer className="border-t border-obsidian-900 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <button onClick={() => navigate('/')} className="font-display text-lg font-bold text-gradient">CVCraft</button>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate('/cv-builder')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">CV Builder</button>
            <button onClick={() => navigate('/cv-writing-guide')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">CV Guide</button>
            <button onClick={() => navigate('/about')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">About</button>
            <button onClick={() => navigate('/contact')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">Contact</button>
            <button onClick={() => navigate('/privacy-policy')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-service')} className="text-xs text-obsidian-600 transition-colors hover:text-obsidian-400">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
