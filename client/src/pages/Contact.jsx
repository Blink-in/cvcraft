// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, ExternalLink } from 'lucide-react'

// export default function Contact() {
//   const navigate = useNavigate()
//   const [subject, setSubject] = useState('')
//   const [description, setDescription] = useState('')
//   const [email, setEmail] = useState('')
//   const [sent, setSent] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setError('')

//     const trimmedEmail = email.trim()
//     const trimmedDesc = description.trim()
//     if (!trimmedDesc) {
//       setError('Please describe your message.')
//       return
//     }

//     const finalSubject = subject.trim() || `CVCraft Contact – ${new Date().toLocaleDateString()}`
//     const body = [
//       `Subject: ${finalSubject}`,
//       '',
//       'Message:',
//       trimmedDesc,
//       '',
//       trimmedEmail ? `From: ${trimmedEmail}` : 'From: (no email provided)',
//       '',
//       'User agent:',
//       navigator.userAgent,
//       'URL:',
//       window.location.href,
//     ].join('\n')

//     window.location.href = `mailto:felisonemma@gmail.com?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`
//     setSent(true)
//   }

//   return (
//     <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
//       <div className="max-w-3xl mx-auto">
//         <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
//           <ArrowLeft size={14} className="inline mr-1" />
//           Back
//         </button>

//         <div className="card p-8 md:p-12 mb-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
//               <Mail size={24} className="text-amber-400" />
//             </div>
//             <div>
//               <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Contact Us</h1>
//               <p className="text-sm text-obsidian-500 mt-1">We read every message and reply promptly.</p>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <div className="md:col-span-2">
//               {sent ? (
//                 <div className="text-center py-12">
//                   <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
//                   <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-2">Message Ready</h2>
//                   <p className="text-sm text-obsidian-400">Your email client should have opened. If it didn't, email us directly.</p>
//                   <button onClick={() => navigate('/')} className="mt-5 btn-primary py-2 px-6 text-sm">
//                     Back to Home
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-medium text-obsidian-400 mb-1">Your Email (optional)</label>
//                     <div className="relative">
//                       <MessageSquare size={14} className="absolute left-3 top-2.5 text-obsidian-500" />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                         placeholder="you@example.com"
//                         className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-medium text-obsidian-400 mb-1">Subject</label>
//                     <input
//                       type="text"
//                       value={subject}
//                       onChange={e => setSubject(e.target.value)}
//                       placeholder="What's this about?"
//                       className="w-full px-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-medium text-obsidian-400 mb-1">Message <span className="text-red-400">*</span></label>
//                     <textarea
//                       value={description}
//                       onChange={e => setDescription(e.target.value)}
//                       placeholder="Tell us what's on your mind..."
//                       rows={6}
//                       required
//                       className="w-full px-3 py-2.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-100 text-sm outline-none focus:border-amber-500/50 resize-none"
//                     />
//                   </div>

//                   {error && (
//                     <p className="text-xs text-red-300 border border-red-500/20 bg-red-500/10 px-3 py-2 rounded">{error}</p>
//                   )}

//                   <button type="submit" className="w-full btn-primary py-3 px-4 text-sm">
//                     <Send size={14} className="mr-1.5" />
//                     Send Message
//                   </button>

//                   <p className="text-[10px] text-obsidian-600 text-center leading-relaxed">
//                     This opens your default email client. No data is collected on our servers.
//                   </p>
//                 </form>
//               )}
//             </div>

//             <div className="space-y-4">
//               <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
//                 <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Email</p>
//                 <p className="text-sm text-obsidian-100">felisonemma@gmail.com</p>
//               </div>
//               <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
//                 <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Response Time</p>
//                 <p className="text-sm text-obsidian-100">Usually within 24 hours</p>
//               </div>
//               <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
//                 <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Bug Reports</p>
//                 <button onClick={() => navigate('/report-issue')} className="text-sm text-amber-400 hover:underline flex items-center gap-1">
//                   Report an Issue <ExternalLink size={12} />
//                 </button>
//               </div>
//               <div className="p-4 rounded-lg bg-obsidian-800 border border-obsidian-700">
//                 <p className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">Privacy</p>
//                 <button onClick={() => navigate('/privacy-policy')} className="text-sm text-amber-400 hover:underline">Privacy Policy</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Frequently asked */}
//         <div className="card p-8 md:p-10">
//           <h2 className="font-display text-2xl font-bold text-obsidian-100 mb-6">Frequently Asked Questions</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="font-semibold text-obsidian-100 mb-1">Is the contact form really private?</h3>
//               <p className="text-sm text-obsidian-400 leading-relaxed">Yes. The contact form simply opens your email client — no data is sent to our servers. Your message goes directly from your email app to our inbox.</p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-obsidian-100 mb-1">Do I need to create an account to contact you?</h3>
//               <p className="text-sm text-obsidian-400 leading-relaxed">No account is needed. You can reach us directly at felisonemma@gmail.com or use the form above.</p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-obsidian-100 mb-1">How do I report a bug?</h3>
//               <p className="text-sm text-obsidian-400 leading-relaxed">Use our dedicated <button onClick={() => navigate('/report-issue')} className="text-amber-400 hover:underline">Report an Issue</button> page. It includes your browser details automatically to help us reproduce and fix the problem faster.</p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-obsidian-100 mb-1">Can I suggest a new feature?</h3>
//               <p className="text-sm text-obsidian-400 leading-relaxed">Absolutely! We welcome feature requests and feedback. Just send us a message through the form or email us directly.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare, Bug, Clock, CheckCircle } from 'lucide-react'

const TOPICS = [
  { icon: Bug,           title: 'Report a Bug',          desc: 'Something broken? Screenshots help a lot.',          subject: 'Bug Report — CVCraft' },
  { icon: MessageSquare, title: 'Feature Request',        desc: 'Got an idea that would make CVCraft better?',        subject: 'Feature Request — CVCraft' },
  { icon: Mail,          title: 'Payment Issue',          desc: 'Problem with a Paystack or Flutterwave payment.',    subject: 'Payment Issue — CVCraft' },
  { icon: CheckCircle,   title: 'General Question',       desc: 'Anything else — we read every message.',             subject: 'General Enquiry — CVCraft' },
]

export default function Contact() {
  const navigate  = useNavigate()
  const EMAIL     = 'support@getcvcraft.com'

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1.5" />Back
        </button>

        {/* Header */}
        <div className="card p-8 md:p-10 mb-6">
          <h1 className="font-display text-4xl font-bold text-obsidian-100 mb-3">Contact Us</h1>
          <p className="text-obsidian-300 leading-relaxed mb-1">
            We're a small team and we genuinely read every message. Whether it's a bug report, a billing question, or just feedback — reach out.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Clock size={14} className="text-amber-400 flex-shrink-0" />
            <span className="text-obsidian-400">Typical response time: <strong className="text-obsidian-200">within 24–48 hours</strong> on business days.</span>
          </div>
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {TOPICS.map(({ icon: Icon, title, desc, subject }) => (
            <a
              key={title}
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
              className="card p-5 hover:border-amber-500/30 transition-all duration-200 hover:-translate-y-0.5 block group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Icon size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-obsidian-100 mb-0.5">{title}</p>
                  <p className="text-xs text-obsidian-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Direct email */}
        <div className="card p-8 text-center">
          <Mail size={28} className="text-amber-400 mx-auto mb-3" />
          <h2 className="font-display font-semibold text-lg text-obsidian-100 mb-1">Email us directly</h2>
          <p className="text-sm text-obsidian-400 mb-4">Click below or copy the address into your email client.</p>
          <a
            href={`mailto:${EMAIL}`}
            className="btn-primary py-3 px-8 text-sm inline-flex"
          >
            <Mail size={15} />
            {EMAIL}
          </a>
          <div className="mt-8 pt-6 border-t border-obsidian-800 text-left space-y-2 text-xs text-obsidian-500">
            <p className="font-semibold text-obsidian-400 uppercase tracking-wider text-[10px] mb-2">Tips for faster support</p>
            <p>• For bugs: include your browser, device, and a description of what you were doing</p>
            <p>• For payment issues: include your order reference or the email used at checkout</p>
            <p>• For CV export problems: let us know which template you were using</p>
          </div>
        </div>
      </div>
    </div>
  )
}
