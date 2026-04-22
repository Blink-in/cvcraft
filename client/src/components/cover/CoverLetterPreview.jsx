function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

export default function CoverLetterPreview({ cl }) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const accent = cl.customization?.accentColor || '#c9a84c'
  const primary = cl.customization?.primaryColor || '#1a1814'

  return (
    <div
      id="cover-letter-preview"
      style={{
        width: 'min(794px, 100%)',
        minHeight: '1122px',
        background: '#ffffff',
        color: '#1a1814',
        fontFamily: cl.customization?.fontFamily || 'DM Sans, sans-serif',
        fontSize: '13.5px',
        lineHeight: 1.6,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div style={{ background: primary, padding: '32px 52px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '700', color: '#faf8f3', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Cover Letter
            </h1>
            {cl.jobTitle && cl.company && (
              <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginTop: '5px', opacity: 0.9 }}>
                {cl.jobTitle} · {cl.company}
              </p>
            )}
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(250,248,243,0.5)' }}>{today}</p>
        </div>
      </div>

      {/* Accent bar */}
      <div style={{ height: '3px', background: `linear-gradient(to right, ${accent}, transparent)` }} />

      {/* Body */}
      <div style={{ padding: '40px 52px' }}>
        {cl.hiringManager && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontWeight: '600', fontSize: '13px' }}>Dear {cl.hiringManager},</p>
          </div>
        )}

        {cl.content ? (
          <div style={{ whiteSpace: 'pre-wrap', color: '#2a2824', lineHeight: 1.8, fontSize: '13.5px' }}>
            {parseHtml(cl.content)}
          </div>
        ) : (
          <div style={{ color: '#b0a898', fontStyle: 'italic', lineHeight: 1.8 }}>
            <p>Your cover letter will appear here once generated or typed.</p>
            <br />
            <p>Fill in the job details on the left and click "Generate with AI" to create a tailored letter instantly — or write your own in the editor below.</p>
          </div>
        )}
      </div>

      {/* Footer accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
    </div>
  )
}
