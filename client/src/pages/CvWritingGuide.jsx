import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, AlertTriangle, Lightbulb, FileText, Layout, Type, Target } from 'lucide-react'

const TIPS = [
  { icon: FileText, title: 'Use Action Verbs', desc: 'Start bullet points with strong verbs like Led, Built, Increased, Optimized, Streamlined, and Developed. Avoid "Responsible for" and "Tasked with."' },
  { icon: Layout, title: 'Keep It to One Page', desc: 'Unless you have 10+ years of experience, aim for a single page. Recruiters spend an average of 7 seconds on the first review — make every line count.' },
  { icon: Type, title: 'Quantify Your Impact', desc: 'Replace vague claims with numbers. Instead of "improved performance," write "reduced load time by 40%." Numbers give hiring managers concrete evidence of your value.' },
  { icon: Target, title: 'Tailor to the Job', desc: 'Mirror keywords and phrases from the job description. Most companies use ATS (Applicant Tracking Systems) that scan for specific terms before a human ever reads your CV.' },
]

const MISTAKES = [
  'Typos and grammatical errors',
  'Inconsistent formatting',
  'Including irrelevant personal details (age, marital status, photo unless required)',
  'Vague responsibilities without achievements',
  "Listing duties instead of showing impact",
  'Using a generic summary for every application',
  'Including references ("available on request")',
  'Using an unprofessional email address',
]

export default function CvWritingGuide() {
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
              <BookOpen size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">How to Write a CV That Gets Interviews</h1>
              <p className="text-sm text-obsidian-500 mt-1">A complete guide with examples, tips, and common mistakes to avoid.</p>
            </div>
          </div>

          <p className="text-obsidian-300 leading-relaxed mb-4">
            Your CV is your first impression — and in today's job market, you might only get one shot at it. Hiring managers and recruiters spend an average of 7 to 10 seconds scanning a CV before making an initial decision. If your CV doesn't communicate value immediately, it won't make it past the first round.
          </p>
          <p className="text-obsidian-300 leading-relaxed">
            This guide covers everything you need to write a compelling, ATS-friendly CV. Whether you're a recent graduate, a mid-career professional, or an executive, the principles below apply at every level.
          </p>
        </div>

        {/* Quick tips */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">Top 4 CV Writing Principles</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {TIPS.map(tip => (
              <div key={tip.title} className="p-5 rounded-xl bg-obsidian-800/50 border border-obsidian-700">
                <div className="flex items-center gap-2 mb-3">
                  <tip.icon size={16} className="text-amber-400" />
                  <h3 className="font-semibold text-obsidian-100 text-sm">{tip.title}</h3>
                </div>
                <p className="text-xs text-obsidian-400 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Structure guide */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">The Ideal CV Structure</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">1. Header & Contact Details</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Include your full name, phone number, professional email, LinkedIn URL (if you have one), and city/country. Skip the photo unless it's standard in your country or specifically requested.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">2. Professional Summary</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Write 2–3 sentences summarizing your experience, key skills, and what you bring to a role. Keep it achievement-focused, not duty-focused. Example: "Product designer with 5 years of experience shipping SaaS products used by 2M+ users. Specializes in design systems and user research."</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">3. Work Experience</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">List roles in reverse chronological order. For each role, include company name, job title, dates, and 3–5 bullet points focused on achievements with measurable outcomes. This is the most important section — allocate the most space here.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">4. Skills Section</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Group skills by category (e.g., Technical Skills, Languages, Tools). Be specific: instead of "programming," list "Python, React, PostgreSQL." Include proficiency levels if relevant (e.g., "Native," "Fluent," "Conversational" for languages).</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">5. Education</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Include degree, institution, graduation year, and relevant honors or GPA if it strengthens your profile. Keep this section brief if you have significant professional experience.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">6. Optional Sections</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Certifications, projects, publications, volunteer work, or languages can add value. Only include sections that are relevant to the roles you're targeting. Do not pad your CV with fluff.</p>
            </div>
          </div>
        </div>

        {/* Common mistakes */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-2">Common CV Mistakes</h2>
          <p className="text-sm text-obsidian-400 mb-6">Even strong candidates get rejected because of these avoidable errors:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {MISTAKES.map(m => (
              <div key={m} className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-obsidian-300">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ATS section */}
        <div className="card p-8 md:p-10 mb-8">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-4">How ATS Systems Evaluate Your CV</h2>
          <p className="text-sm text-obsidian-400 leading-relaxed mb-4">
            Over 75% of large companies use Applicant Tracking Systems (ATS) to filter CVs before a human sees them. These systems scan for keywords, parse sections, and rank candidates automatically. If your CV isn't formatted for ATS, it may be rejected before it reaches a recruiter.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian-300">Use standard section headings (Experience, Education, Skills)</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian-300">Avoid tables, text boxes, and complex graphics that parsers can't read</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian-300">Include exact keywords from the job description</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian-300">Save and submit as PDF, not Word, when in doubt</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-obsidian-300">Use common fonts (Arial, Calibri, Helvetica, Garamond)</p>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="card p-8 md:p-10 mb-8">
          <Lightbulb size={24} className="text-amber-400 mb-3" />
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-3">Final Checklist Before You Send</h2>
          <p className="text-sm text-obsidian-400 leading-relaxed">
            Before you hit "send," double-check that your CV is tailored to the specific job, free of typos, formatted consistently, ATS-friendly, and under two pages. Ask a friend to review it with fresh eyes. If you're proud of what you've built, a hiring manager might be too.
          </p>
        </div>

        <div className="text-center mt-12">
          <button onClick={() => navigate('/')} className="btn-primary text-base py-3 px-8 glow-gold">
            Build Your CV Now
          </button>
        </div>
      </div>
    </div>
  )
}
