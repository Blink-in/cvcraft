// ─── Executive Template ──────────────────────────────────────────────────────
function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
}

export function ExecutiveTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#94a3b8'
  const primary = c?.primaryColor || '#1e293b'

  const SectionTitle = ({ children }) => (
    <div style={{ marginBottom: '12px', marginTop: '22px' }}>
      <h3 style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: accent, marginBottom: '5px' }}>{children}</h3>
      <div style={{ height: '1px', background: `linear-gradient(to right, ${accent}, transparent)` }} />
    </div>
  )

  return (
    <div style={{ background: '#ffffff', color: '#1e293b', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Header */}
      <div style={{ background: primary, padding: '44px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', color: '#f8fafc', lineHeight: 1.1 }}>
            {p.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: accent, marginTop: '8px' }}>{p.title}</p>
        </div>
        {p.photo && (
          <img src={p.photo} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover', border: `1px solid ${accent}40` }} />
        )}
      </div>

      {/* Contact bar */}
      <div style={{ background: '#f1f5f9', padding: '10px 52px', display: 'flex', flexWrap: 'wrap', gap: '20px', borderBottom: `2px solid ${accent}` }}>
        {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((item, i) => (
          <span key={i} style={{ fontSize: '10.5px', color: '#64748b' }}>{item}</span>
        ))}
      </div>

      <div style={{ padding: '24px 52px' }}>
        {sections.personal?.visible !== false && p.summary && (
          <>
            <SectionTitle>Executive Summary</SectionTitle>
            <p style={{ fontSize: '12.5px', lineHeight: 1.8, color: '#334155', fontStyle: 'italic', borderLeft: `3px solid ${accent}`, paddingLeft: '14px' }}>{p.summary}</p>
          </>
        )}

        {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
          <>
            <SectionTitle>Professional Experience</SectionTitle>
            {sections.experience.data.map(exp => (
              <div key={exp.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.role}</p>
                    <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 10px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </span>
                </div>
                {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
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
                    <p style={{ fontSize: '10.5px', color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>
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
                    <span key={s} style={{ fontSize: '10.5px', padding: '3px 10px', border: `1px solid ${accent}40`, borderRadius: '2px', color: '#334155' }}>{s}</span>
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

// ─── Creative Template ────────────────────────────────────────────────────────
export function CreativeTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#a855f7'
  const primary = c?.primaryColor || '#1a0a2e'

  const SectionTitle = ({ children }) => (
    <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', color: accent, marginBottom: '12px', marginTop: '20px' }}>{children}</h3>
  )

  return (
    <div style={{ background: '#ffffff', color: '#1a0a2e', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Diagonal header */}
      <div style={{ position: 'relative', background: primary, padding: '40px 44px 70px', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)', marginBottom: '-30px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
          {p.photo && (
            <img src={p.photo} alt="profile" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flexShrink: 0 }} />
          )}
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: '700', color: '#faf5ff', letterSpacing: '-1px', lineHeight: 1 }}>{p.name || 'Your Name'}</h1>
            <p style={{ fontSize: '12px', color: accent, letterSpacing: '2.5px', textTransform: 'uppercase', margin: '6px 0 12px' }}>{p.title}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              {[p.email, p.phone, p.location].filter(Boolean).map((item, i) => (
                <span key={i} style={{ fontSize: '11px', color: 'rgba(250,245,255,0.6)' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', padding: '10px 0 0' }}>
        <div style={{ padding: '16px 36px' }}>
          {sections.personal?.visible !== false && p.summary && (
            <>
              <SectionTitle>About</SectionTitle>
              <p style={{ fontSize: '12.5px', lineHeight: 1.75, color: '#3b2060' }}>{p.summary}</p>
            </>
          )}

          {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {sections.experience.data.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: '18px', paddingLeft: '14px', borderLeft: `3px solid ${i % 2 === 0 ? accent : `${accent}50`}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '13px', color: '#1a0a2e' }}>{exp.role}</p>
                      <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: '10px', color: '#7c3aed', background: `${accent}15`, padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap', height: 'fit-content' }}>
                      {exp.startDate}{exp.endDate ? `–${exp.endDate}` : ''}
                    </span>
                  </div>
                  {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#3b2060', marginTop: '5px', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
                </div>
              ))}
            </>
          )}

          {sections.projects?.visible !== false && sections.projects?.data?.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {sections.projects.data.map(proj => (
                <div key={proj.id} style={{ marginBottom: '14px', padding: '10px 12px', background: `${accent}08`, borderRadius: '6px', border: `1px solid ${accent}20` }}>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a0a2e' }}>{proj.name}</p>
                  {proj.technologies && <p style={{ fontSize: '10px', color: accent, fontStyle: 'italic', margin: '2px 0 4px' }}>{proj.technologies}</p>}
                  {proj.description && <p style={{ fontSize: '11.5px', color: '#3b2060', lineHeight: 1.6 }}>{proj.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ padding: '16px 20px', background: `${accent}08`, borderLeft: `1px solid ${accent}20` }}>
          {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
            <>
              <SectionTitle>Education</SectionTitle>
              {sections.education.data.map(edu => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontWeight: '600', fontSize: '12px', color: '#1a0a2e' }}>{edu.degree}</p>
                  <p style={{ fontSize: '11px', color: accent }}>{edu.school}</p>
                  <p style={{ fontSize: '10px', color: '#7c3aed' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                </div>
              ))}
            </>
          )}

          {sections.skills?.visible !== false && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {Object.entries(sections.skills.data).map(([cat, skills]) =>
                skills?.length > 0 ? (
                  <div key={cat} style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: `${accent}80`, marginBottom: '4px' }}>
                      {cat}
                    </p>
                    {skills.map(s => (
                      <div key={s} style={{ fontSize: '11px', color: '#1a0a2e', padding: '2px 0', borderBottom: `1px solid ${accent}15` }}>{s}</div>
                    ))}
                  </div>
                ) : null
              )}
            </>
          )}

          {sections.certifications?.visible !== false && sections.certifications?.data?.length > 0 && (
            <>
              <SectionTitle>Certs</SectionTitle>
              {sections.certifications.data.map(cert => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '600', fontSize: '11px', color: '#1a0a2e' }}>{cert.name}</p>
                  <p style={{ fontSize: '10px', color: accent }}>{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Default export for ExecutiveTemplate
export default ExecutiveTemplate
