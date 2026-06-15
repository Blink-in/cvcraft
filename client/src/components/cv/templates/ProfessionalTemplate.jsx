// Professional Template
function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
}

export default function ProfessionalTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#42a5f5'
  const primary = c?.primaryColor || '#1565c0'

  const SectionTitle = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', marginTop: '22px' }}>
      <h3 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: accent, marginBottom: '4px' }}>{children}</h3>
      <div style={{ flex: 1, height: '1px', background: accent, opacity: 0.4 }} />
    </div>
  )

  return (
    <div style={{ background: '#ffffff', color: '#1565c0', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Header */}
      <div style={{ background: primary, padding: '40px 48px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#ffffff' }}>
            {p.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e3f2fd', marginTop: '8px' }}>{p.title}</p>
        </div>
        {p.photo && (
          <img src={p.photo} alt="profile" style={{ width: '90px', height: '90px', borderRadius: '4px', objectFit: 'cover', border: `3px solid ${accent}40` }} />
        )}
      </div>

      {/* Contact bar */}
      <div style={{ background: '#f8f9fa', padding: '12px 48px', display: 'flex', flexWrap: 'wrap', gap: '20px', borderBottom: `2px solid ${accent}20` }}>
        {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((item, i) => (
          <span key={i} style={{ fontSize: '10.5px', color: '#64748b' }}>{item}</span>
        ))}
      </div>

      <div style={{ padding: '24px 48px', paddingBottom: '48px' }}>
        {sections.personal?.visible !== false && p.summary && (
          <>
            <SectionTitle>Professional Summary</SectionTitle>
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
                    <p style={{ fontWeight: '600', fontSize: '13.5px', color: '#1565c0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.role}</p>
                    <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', background: '#f8f9fa', padding: '2px 10px', borderRadius: '2px', whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </span>
                </div>
                {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
              </div>
            ))}
          </>
        )}

        {/* Three columns layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 30px', marginTop: '4px' }}>
          <div>
            {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
              <>
                <SectionTitle>Education</SectionTitle>
                {sections.education.data.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <p style={{ fontWeight: '600', fontSize: '12.5px' }}>{edu.degree}</p>
                    <p style={{ fontSize: '12px', color: accent }}>{edu.school}</p>
                    <p style={{ fontSize: '10.5px', color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {sections.skills?.visible !== false && sections.skills.data.technical?.length > 0 && (
              <>
                <SectionTitle>Technical Skills</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {sections.skills.data.technical.map(s => (
                    <span key={s} style={{ fontSize: '10.5px', padding: '3px 10px', background: '#f8f9fa', border: `1px solid ${accent}40`, borderRadius: '4px', color: '#334155' }}>{s}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            {sections.certifications?.visible !== false && sections.certifications?.data?.length > 0 && (
              <>
                <SectionTitle>Certifications</SectionTitle>
                {sections.certifications.data.map(cert => (
                  <div key={cert.id} style={{ marginBottom: '10px' }}>
                    <p style={{ fontWeight: '600', fontSize: '11.5px', color: '#1565c0' }}>{cert.name}</p>
                    <p style={{ fontSize: '10.5px', color: accent }}>{cert.issuer}</p>
                    {cert.date && <p style={{ fontSize: '10px', color: '#94a3b8' }}>{cert.date}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {sections.skills?.visible !== false && (
          <div style={{ marginTop: '24px' }}>
            <SectionTitle>Additional Skills</SectionTitle>
            <div style={{ display: 'flex', gap: '16px' }}>
              {sections.skills.data.soft?.length > 0 && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>Soft Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sections.skills.data.soft.map(s => (
                      <span key={s} style={{ fontSize: '10px', background: '#e3f2fd', padding: '4px 8px', borderRadius: '12px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {sections.skills.data.languages?.length > 0 && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', color: accent, marginBottom: '8px' }}>Languages</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sections.skills.data.languages.map(s => (
                      <span key={s} style={{ fontSize: '10px', background: '#e3f2fd', padding: '4px 8px', borderRadius: '12px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {sections.projects?.visible !== false && sections.projects?.data?.length > 0 && (
          <>
            <SectionTitle>Projects</SectionTitle>
            {sections.projects.data.map(proj => (
              <div key={proj.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '13px', color: '#1565c0' }}>{proj.name}</p>
                    {proj.url && <a href={proj.url} style={{ marginLeft: '8px', fontSize: '10px', color: accent }}>→</a>}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {proj.startDate}{proj.endDate ? ` — ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>
                {proj.technologies && <p style={{ fontSize: '10.5px', color: '#7a7367', fontStyle: 'italic' }}>{proj.technologies}</p>}
                {proj.description && <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#475569', marginTop: '4px' }}>{proj.description}</p>}
              </div>
            ))}
          </>
        )}
        </div>
      </div>

    )
  }
