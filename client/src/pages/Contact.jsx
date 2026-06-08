import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, ExternalLink } from 'lucide-react'

export default function Contact() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    const trimmedDesc = description.trim()
    if (!trimmedDesc) {
      setError('Please describe your message.')
      return
    }

    const finalSubject = subject.trim() || `CVCraft Contact – ${new Date().toLocaleDateString()}`
    const body = [
      `Subject: ${finalSubject}`,
      '',
      'Message:',
      trimmedDesc,
      '',
      trimmedEmail ? `From: ${trimmedEmail}` : 'From: (no email provided)',
      '',
      'User agent:',
      navigator.userAgent,
      'URL:',
      window.location.href,
    ].join('\n')

    window.location.href = `mailto:felisonemma@gmail.com?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1" />
          Back
        </button>

        <div className="card p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Mail size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Contact Us</h1>
              <p className="text-sm text-obsidian-500 mt-1">We read every message and reply promptly.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
                  <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-2">Message Ready</h2>
                  <p className="text-sm text-obsidian-400">Your email client should have opened. If it didn't, email us directly.</p>
                  <button onClick={() => navigate('/')} className="mt-5 btn-primary py-2 px-6 text-sm">
                    Back to Home
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-obsidian-400 mb-1">Your Email (optional)</label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-2.5 text-obsidian-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-obsidian-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-obsidian-400 mb-1">Message <span className="text-red-400">*</span></label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      required
                      className="w-full px-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-300 border border-red-500/20 bg-red-500/10 px-3 py-2 rounded">{error}</p>
                  )}

                  <button type="submit" className="w-full btn-primary py-3 px-4 text-sm">
                    <Send size={14} className="mr-1.5" />
                    Send Message
                  </button>

                  <p className="text-[10px] text-obsidian-600 text-center leading-relaxed">
                    This opens your default email client. No data is collected on our servers.
                  </p>
                </form>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
                <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Email</p>
                <p className="text-sm text-obsidian-100">felisonemma@gmail.com</p>
              </div>
              <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
                <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Response Time</p>
                <p className="text-sm text-obsidian-100">Usually within 24 hours</p>
              </div>
              <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
                <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Bug Reports</p>
                <button onClick={() => navigate('/report-issue')} className="text-sm text-amber-400 hover:underline flex items-center gap-1">
                  Report an Issue <ExternalLink size={12} />
                </button>
              </div>
              <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
                <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Privacy</p>
                <button onClick={() => navigate('/privacy-policy')} className="text-sm text-amber-400 hover:underline">Privacy Policy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently asked */}
        <div className="card p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">Is the contact form really private?</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Yes. The contact form simply opens your email client — no data is sent to our servers. Your message goes directly from your email app to our inbox.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">Do I need to create an account to contact you?</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">No account is needed. You can reach us directly at felisonemma@gmail.com or use the form above.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">How do I report a bug?</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Use our dedicated <button onClick={() => navigate('/report-issue')} className="text-amber-400 hover:underline">Report an Issue</button> page. It includes your browser details automatically to help us reproduce and fix the problem faster.</p>
            </div>
            <div>
              <h3 className="font-semibold text-obsidian-100 mb-1">Can I suggest a new feature?</h3>
              <p className="text-sm text-obsidian-400 leading-relaxed">Absolutely! We welcome feature requests and feedback. Just send us a message through the form or email us directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
