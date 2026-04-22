const S = {
  sheet: {
    background: '#ffffff',
    color: '#1a1814',
    fontFamily: 'inherit',
    minHeight: '1122px',
    fontSize: 'inherit',
    lineHeight: 1.5,
  }
}

function parseHtml(html) {
  if (!html) return ''
  return html
    .replace(/<strong>(.*?)<\/strong>/gi, '$1')
    .replace(/<em>(.*?)<\/em>/gi, '$1')
    .replace(/<u>(.*?)<\/u>/gi, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/?(ul|ol|li)[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export default function ClassicTemplate({ cv }) {
  const { sections, sectionOrder, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#c9a84c'
  const primary = c?.primaryColor || '#1a1814'

  const SectionTitle = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: primary, whiteSpace: 'nowrap' }}>
        {children}
      </h3>
      <div style={{ flex: 1, height: '1px', background: accent, opacity: 0.4 }} />
    </div>
  )

  return (
    <div style={S.sheet}>
      {/* Header */}
      <div style={{ background: primary, color: '#faf8f3', padding: '36px 44px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {p.photo && (
            <img src={p.photo} alt="profile" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}`, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '4px' }}>
              {p.name || 'Your Name'}
            </h1>
            <p style={{ fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', color: accent, marginBottom: '14px', opacity: 0.9 }}>
              {p.title || 'Job Title'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((item, i) => (
                <span key={i} style={{ fontSize: '11px', color: 'rgba(250,248,243,0.65)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: 'calc(1122px - 148px)' }}>
        {/* Main column */}
        <div style={{ padding: '24px 36px', borderRight: '1px solid #e8e4da' }}>
          {sections.personal?.visible !== false && p.summary && (
            <>
              <SectionTitle>Profile</SectionTitle>
              <p style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#3a3830', marginBottom: '4px' }}>{p.summary}</p>
            </>
          )}

          {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {sections.experience.data.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a1814' }}>{exp.role}</p>
                      <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#7a7367', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '2px' }}>
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#3a3830', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                      {parseHtml(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {sections.projects?.visible !== false && sections.projects?.data?.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {sections.projects.data.map(proj => (
                <div key={proj.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a1814' }}>
                        {proj.name}
                        {proj.url && <a href={proj.url} style={{ marginLeft: '6px', fontSize: '10px', color: accent }}>↗</a>}
                      </p>
                      {proj.technologies && <p style={{ fontSize: '10.5px', color: '#7a7367', fontStyle: 'italic' }}>{proj.technologies}</p>}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span style={{ fontSize: '10.5px', color: '#7a7367', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}
                      </span>
                    )}
                  </div>
                  {proj.description && <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#3a3830', marginTop: '4px' }}>{proj.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar column */}
        <div style={{ padding: '24px 24px', background: '#faf8f3' }}>
          {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
            <>
              <SectionTitle>Education</SectionTitle>
              {sections.education.data.map(edu => (
                <div key={edu.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontWeight: '600', fontSize: '12px', color: '#1a1814' }}>{edu.degree}</p>
                  <p style={{ fontSize: '11.5px', color: accent, fontWeight: '500' }}>{edu.school}</p>
                  {edu.field && <p style={{ fontSize: '10.5px', color: '#7a7367' }}>{edu.field}</p>}
                  <p style={{ fontSize: '10.5px', color: '#7a7367' }}>
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                    {edu.grade ? ` · ${edu.grade}` : ''}
                  </p>
                </div>
              ))}
            </>
          )}

          {sections.skills?.visible !== false && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {Object.entries(sections.skills.data).map(([cat, skills]) =>
                skills?.length > 0 ? (
                  <div key={cat} style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7367', marginBottom: '5px' }}>
                      {cat === 'technical' ? 'Technical' : cat === 'soft' ? 'Soft Skills' : 'Languages'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {skills.map(s => (
                        <span key={s} style={{ fontSize: '10.5px', padding: '2px 8px', background: 'white', border: '1px solid #d8d0be', borderRadius: '3px', color: '#3a3830' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </>
          )}

          {sections.certifications?.visible !== false && sections.certifications?.data?.length > 0 && (
            <>
              <SectionTitle>Certifications</SectionTitle>
              {sections.certifications.data.map(cert => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '11.5px', color: '#1a1814' }}>{cert.name}</p>
                  <p style={{ fontSize: '10.5px', color: accent }}>{cert.issuer}</p>
                  {cert.date && <p style={{ fontSize: '10px', color: '#7a7367' }}>{cert.date}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
