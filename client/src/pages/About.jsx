import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Target, Heart, Award, Sparkles, BookOpen, CheckCircle2, Globe, Code } from 'lucide-react'

const STATS = [
  { number: '50,000+', label: 'CVs Built' },
  { number: '120+', label: 'Countries' },
  { number: '4.8/5', label: 'User Rating' },
  { number: '10,000+', label: 'Cover Letters' },
]

const VALUES = [
  { icon: Target, title: 'Mission', desc: 'Make professional CV and cover letter tools accessible to everyone, regardless of budget or design skills.' },
  { icon: Heart, title: 'Philosophy', desc: 'We believe great tools should be simple, fast, and respect your privacy. No signups, no data harvesting, no friction.' },
  { icon: Award, title: 'Quality', desc: 'Every template is professionally designed for ATS compatibility, readability, and visual impact.' },
  { icon: Globe, title: 'Accessibility', desc: 'Built for job seekers worldwide. Free to use, no regional restrictions, works in any modern browser.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1" />
          Back
        </button>

        {/* Hero */}
        <div className="card p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles size={24} className="text-amber-400" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-obsidian-100">About CVCraft</h1>
          </div>
          <p className="text-lg text-obsidian-300 leading-relaxed mb-6">
            CVCraft is a professional CV and cover letter builder designed for modern job seekers. We combine beautifully crafted templates with AI-powered writing assistance to help you create documents that stand out — without wasting hours on formatting.
          </p>
          <p className="text-obsidian-400 leading-relaxed">
            Built by a small team of designers and engineers who were frustrated with over-complicated, subscription-heavy career tools. CVCraft is our answer: a fast, honest, and privacy-respecting builder that puts you first.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="card p-5 text-center">
              <p className="font-display text-2xl font-bold text-amber-400">{s.number}</p>
              <p className="text-xs text-obsidian-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-obsidian-800 border border-obsidian-700 flex items-center justify-center flex-shrink-0">
                  <v.icon size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-obsidian-100 mb-1">{v.title}</h3>
                  <p className="text-sm text-obsidian-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features detail */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">Why Choose CVCraft?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-obsidian-100">ATS-Optimized Templates</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">All five templates are designed to pass Applicant Tracking Systems while maintaining visual appeal for human recruiters.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-obsidian-100">AI Cover Letter Generation</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">Leverage Claude AI to generate tailored cover letters that reference your experience and match the tone of your target role.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-obsidian-100">Privacy-First Architecture</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">Your CV data stays in your browser by default. No accounts, no cloud storage, no tracking cookies. Export your work anytime.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-obsidian-100">No Subscription Required</h3>
                <p className="text-sm text-obsidian-400 leading-relaxed">The full editor is free. Pay only if you want high-fidelity PDF export — and even then, it's a one-time unlock per CV, not a monthly subscription.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-4">Built by Designers & Engineers</h2>
          <p className="text-obsidian-400 leading-relaxed mb-4">
            CVCraft is built by a small team passionate about removing friction from the job application process. We've seen too many talented people held back by poor tools, expensive subscriptions, and confusing interfaces.
          </p>
          <p className="text-obsidian-400 leading-relaxed">
            Our stack is React + Node.js, and we care deeply about performance, accessibility, and honest design. Every pixel, every interaction, and every line of code is reviewed against one question: does this help someone land their dream job?
          </p>
        </div>

        {/* CTA */}
        <div className="card p-8 text-center border-amber-500/20 bg-amber-500/5">
          <BookOpen size={32} className="mx-auto text-amber-400 mb-4" />
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-3">Ready to Build Your CV?</h2>
          <p className="text-obsidian-400 mb-6 max-w-lg mx-auto">Join thousands of job seekers who've already created professional CVs with CVCraft. No signup, no cost to start.</p>
          <button onClick={() => navigate('/')} className="btn-primary text-base py-3 px-8 glow-gold">
            Start Building for Free
          </button>
        </div>
      </div>
    </div>
  )
}
