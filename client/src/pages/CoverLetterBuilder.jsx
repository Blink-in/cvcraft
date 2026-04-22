import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/index.js'
import { useEffect, useState, useRef } from 'react'
import { ArrowLeft, Sparkles, Download, Eye, EyeOff, Copy, Check } from 'lucide-react'
import RichTextEditor from '../components/ui/RichTextEditor.jsx'
import CoverLetterPreview from '../components/cover/CoverLetterPreview.jsx'
import { downloadCoverLetterPDF } from '../utils/exportPDF.js'

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Polished & formal' },
  { id: 'confident', label: 'Confident', desc: 'Bold & assertive' },
  { id: 'conversational', label: 'Conversational', desc: 'Warm & approachable' },
  { id: 'creative', label: 'Creative', desc: 'Expressive & unique' },
]

export default function CoverLetterBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { coverLetters, cvs, updateCoverLetter, apiKey, setApiKey } = useStore()
  const cl = coverLetters.find(c => c.id === id)

  const [previewMode, setPreviewMode] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [titleEditing, setTitleEditing] = useState(false)
  const previewRef = useRef()

  useEffect(() => {
    if (!cl) navigate('/dashboard')
  }, [id])

  if (!cl) return null

  const update = (field, value) => updateCoverLetter(id, field, value)

  const saveApiKey = () => {
    setApiKey(apiKeyInput)
    setApiKeyInput('')
    setShowApiKey(false)
  }

  const handleGenerate = async () => {
    if (!apiKey) { setShowApiKey(true); return }
    if (!cl.jobTitle || !cl.company) { setError('Please fill in the job title and company first.'); return }
    setGenerating(true); setError('')

    // Find linked CV for context
    const linkedCV = cvs.find(c => c.id === cl.linkedCvId) || cvs[0]
    const personal = linkedCV?.sections?.personal?.data || {}
    const exp = linkedCV?.sections?.experience?.data || []
    const skills = linkedCV?.sections?.skills?.data || {}

    const expText = exp.slice(0, 3).map(e => `${e.role} at ${e.company} (${e.startDate}–${e.endDate || 'Present'}): ${e.description}`).join('\n')
    const skillsText = [...(skills.technical || []), ...(skills.soft || [])].join(', ')

    const prompt = `Write a compelling cover letter.

Applicant: ${personal.name || 'The Applicant'}
Current Title: ${personal.title || ''}
${expText ? `Experience:\n${expText}` : ''}
${skillsText ? `Skills: ${skillsText}` : ''}
${cl.keySkills ? `Additional key skills: ${cl.keySkills}` : ''}

Job: ${cl.jobTitle} at ${cl.company}
${cl.hiringManager ? `Hiring Manager: ${cl.hiringManager}` : ''}
Tone: ${cl.tone}

Write a complete, ready-to-send cover letter (3–4 paragraphs). 
- Open with a memorable hook (not "I am writing to apply for")
- Reference the specific role and company
- Highlight 2-3 relevant achievements
- Close with a confident call to action
- Use the applicant's actual name and details
- Return only the letter text, no placeholders`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error.message) }
      else {
        const text = data.content?.[0]?.text || ''
        update('content', text)
      }
    } catch (e) {
      setError('Failed to generate. Check your API key and internet connection.')
    }
    setGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cl.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-obsidian-950 font-body overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-obsidian-900 bg-obsidian-950 z-30 flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost py-1.5 px-2.5 text-xs">
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="text-obsidian-700">|</span>

        {titleEditing ? (
          <input
            autoFocus
            value={cl.title}
            onChange={e => update('title', e.target.value)}
            onBlur={() => setTitleEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setTitleEditing(false)}
            className="bg-transparent border-b border-amber-500/50 text-sm font-semibold text-obsidian-100 focus:outline-none px-0 w-48"
          />
        ) : (
          <button onClick={() => setTitleEditing(true)} className="text-sm font-semibold text-obsidian-200 hover:text-obsidian-100 truncate max-w-xs">
            {cl.title}
          </button>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          {cl.content && (
            <button onClick={handleCopy} className="btn-ghost py-1.5 px-3 text-xs">
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          <button onClick={() => setPreviewMode(!previewMode)} className={`btn-ghost py-1.5 px-3 text-xs ${previewMode ? 'text-amber-400 bg-amber-500/10' : ''}`}>
            {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => downloadCoverLetterPDF(cl)} className="btn-primary py-1.5 px-3 text-xs">
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      {showApiKey && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="card max-w-md w-full p-6">
            <h3 className="font-display text-xl font-bold mb-2">🔑 Anthropic API Key</h3>
            <p className="text-sm text-obsidian-400 mb-4 leading-relaxed">
              Your key is stored locally in your browser and only sent directly to Anthropic's API. Get one at <a href="https://console.anthropic.com" target="_blank" className="text-amber-400 hover:underline">console.anthropic.com</a>.
            </p>
            {apiKey ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
                <Check size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-300">API key is set · sk-ant-...{apiKey.slice(-6)}</span>
              </div>
            ) : null}
            <div className="space-y-3">
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveApiKey()}
                className="input-field"
              />
              <div className="flex gap-2">
                <button onClick={saveApiKey} className="btn-primary flex-1 py-2 text-sm" disabled={!apiKeyInput}>
                  Save Key
                </button>
                <button onClick={() => setShowApiKey(false)} className="btn-secondary flex-1 py-2 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Editor ── */}
        {!previewMode && (
          <div className="w-96 flex-shrink-0 border-r border-obsidian-900 overflow-y-auto p-5 space-y-5">

            {/* Job Details */}
            <div className="card p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-obsidian-400">Job Details</h3>
              <div>
                <label className="input-label">Job Title *</label>
                <input className="input-field" value={cl.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="Senior Product Designer" />
              </div>
              <div>
                <label className="input-label">Company *</label>
                <input className="input-field" value={cl.company} onChange={e => update('company', e.target.value)} placeholder="Notion" />
              </div>
              <div>
                <label className="input-label">Hiring Manager (optional)</label>
                <input className="input-field" value={cl.hiringManager} onChange={e => update('hiringManager', e.target.value)} placeholder="Sarah Johnson" />
              </div>
            </div>

            {/* Tone */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-obsidian-400 mb-3">Tone</h3>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update('tone', t.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-150 ${cl.tone === t.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-obsidian-700 hover:border-obsidian-600 text-obsidian-300'}`}
                  >
                    <p className="text-xs font-semibold">{t.label}</p>
                    <p className="text-[10px] text-obsidian-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Key skills */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-obsidian-400 mb-2">Key Skills to Highlight</h3>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={cl.keySkills}
                onChange={e => update('keySkills', e.target.value)}
                placeholder="React, TypeScript, system design, team leadership..."
              />
            </div>

            {/* Link to CV */}
            {cvs.length > 0 && (
              <div className="card p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-obsidian-400 mb-2">Use CV for Context</h3>
                <select className="input-field" value={cl.linkedCvId || ''} onChange={e => update('linkedCvId', e.target.value)}>
                  <option value="">Auto (use first CV)</option>
                  {cvs.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            )}

            {/* AI Generate */}
            <div className="space-y-2">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">{error}</div>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary w-full py-3 text-sm justify-center"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-800 border-t-obsidian-200 rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generate with AI
                  </>
                )}
              </button>
              {!apiKey && (
                <p className="text-xs text-obsidian-500 text-center">
                  Requires Anthropic API key ·{' '}
                  <button onClick={() => setShowApiKey(true)} className="text-amber-400 hover:underline">Set key</button>
                </p>
              )}
            </div>

            {/* Rich text editor */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-obsidian-400 mb-3">Letter Content</h3>
              <RichTextEditor
                content={cl.content}
                onChange={v => update('content', v)}
                placeholder="Write your cover letter here, or use the AI generator above..."
              />
            </div>
          </div>
        )}

        {/* ── Right: Preview ── */}
        <div className="flex-1 overflow-y-auto bg-obsidian-900/30 p-4 md:p-8" ref={previewRef}>
          <div className="flex justify-center">
            <CoverLetterPreview cl={cl} />
          </div>
        </div>
      </div>
    </div>
  )
}
