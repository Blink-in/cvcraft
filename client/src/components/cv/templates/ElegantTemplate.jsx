// ─── Elegant Template ──────────────────────────────────────────────────────
function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
}

export function ElegantTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#8b7355'
  const primary = c?.primaryColor || '#2d2d2d'

  const SectionTitle = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', marginTop: '22px' }}>
      <h3 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '4px' }}>{children}</h3>
      <div style={{ flex: 1, height: '1px', background: accent, opacity: 0.4 }} />
    </div>
  )

  return (
    <div style={{ background: '#fdf6e3', color: '#2d2d2d', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Header */}
      <div style={{ background: primary, padding: '48px 52px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '44px', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1.1, color: '#fdf6e3' }}>
            {p.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', color: accent, marginTop: '8px' }}>{p.title}</p>
        </div>
        {p.photo && (
          <img src={p.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}` }} />
        )}
      </div>

      {/* Contact bar */}
      <div style={{ background: '#fdf6e3', padding: '12px 52px', display: 'flex', flexWrap: 'wrap', gap: '20px', borderBottom: `1px solid ${accent}30` }}>
        {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((item, i) => (
          <span key={i} style={{ fontSize: '10.5px', color: '#5d4037' }}>{item}</span>
        ))}
      </div>

      <div style={{ padding: '24px 52px' }}>
        {sections.personal?.visible !== false && p.summary && (
          <>
            <SectionTitle>Professional Summary</SectionTitle>
            <p style={{ fontSize: '12.5px', lineHeight: 1.8, color: '#4e342e', fontStyle: 'italic', borderLeft: `3px solid ${accent}`, paddingLeft: '14px' }}>{p.summary}</p>
          </>
        )}

        {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
          <>
            <SectionTitle>Professional Experience</SectionTitle>
            {sections.experience.data.map(exp => (
              <div key={exp.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '13.5px', color: '#2d2d2d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.role}</p>
                    <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#8d6e63', background: '#fdf6e3', padding: '2px 10px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </span>
                </div>
                {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#4e342e', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
              </div>
            ))}
          </>
        )}

        {/* Two columns for skills/edu/certs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px', marginTop: '4px' }}>
          <div>
            {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
              <>
                <SectionTitle>Education</SectionTitle>
                {sections.education.data.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <p style={{ fontWeight: '600', fontSize: '12.5px' }}>{edu.degree}</p>
                    <p style={{ fontSize: '12px', color: accent }}>{edu.school}</p>
                    <p style={{ fontSize: '10.5px', color: '#8d6e63' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {sections.skills?.visible !== false && (
              <>
                <SectionTitle>Core Competencies</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {[...(sections.skills.data.technical || []), ...(sections.skills.data.soft || [])].map(s => (
                    <span key={s} style={{ fontSize: '10.5px', padding: '3px 10px', border: `1px solid ${accent}40`, borderRadius: '2px', color: '#4e342e' }}>{s}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export
export default ElegantTemplate