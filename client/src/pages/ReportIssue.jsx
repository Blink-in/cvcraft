import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Bug, MessageSquare } from 'lucide-react'

export default function ReportIssue() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const trimmedEmail = email.trim()
    const trimmedDesc = description.trim()
    if (!trimmedDesc) {
      setError('Please describe the issue.')
      setSending(false)
      return
    }

    const finalSubject = subject.trim() || `CVCraft Bug Report – ${new Date().toLocaleDateString()}`
    const body = [`Subject: ${finalSubject}`, '', 'Description:', trimmedDesc, '', trimmedEmail ? `From: ${trimmedEmail}` : 'From: (no email provided)', '', 'User agent:', navigator.userAgent, 'URL:', window.location.href].join('\n')

    const mailtoUrl = `mailto:felisonemma@gmail.com?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoUrl
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-obsidian-950 font-body flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1" />
          Back
        </button>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bug size={22} className="text-red-400" />
            <h1 className="font-display text-2xl font-bold text-obsidian-100">Report an Issue</h1>
          </div>

          {sent ? (
            <div className="text-center py-10">
              <Send size={40} className="mx-auto text-emerald-400 mb-3" />
              <p className="text-sm text-obsidian-300 mb-1">Your email client should have opened.</p>
              <p className="text-xs text-obsidian-500">If nothing happened, please email us directly at felisonemma@gmail.com</p>
              <button onClick={() => navigate('/dashboard')} className="mt-4 btn-secondary py-2 px-4 text-sm">
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-obsidian-400 mb-1">Subject (optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's the issue about?"
                  className="w-full px-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-400 mb-1">Description <span className="text-red-400">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the bug or issue you encountered..."
                  rows={5}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-obsidian-400 mb-1">Your email (optional – for follow-up)</label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-2.5 text-obsidian-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-300 border border-red-500/20 bg-red-500/10 px-3 py-2 rounded">{error}</p>
              )}

              <button type="submit" disabled={sending} className="w-full btn-primary py-2.5 px-4 text-sm disabled:opacity-50">
                <Send size={14} className="mr-1" />
                {sending ? 'Opening email client…' : 'Send via Email'}
              </button>

              <p className="text-[10px] text-obsidian-600 text-center leading-relaxed">
                This opens your default email client addressed to felisonemma@gmail.com.<br />
                No data is collected on any server.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
