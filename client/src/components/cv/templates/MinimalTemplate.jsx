function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
}

export default function MinimalTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#1a1814'

  const SectionTitle = ({ children }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '24px 0 14px' }}>
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '600', color: accent, whiteSpace: 'nowrap' }}>{children}</h3>
      <div style={{ flex: 1, height: '1px', background: '#e5e0d6' }} />
    </div>
  )

  return (
    <div style={{ background: '#ffffff', color: '#1a1814', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Header */}
      <div style={{ padding: '48px 56px 28px', borderBottom: '2px solid #1a1814' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: '700', letterSpacing: '-2px', lineHeight: 0.95, color: '#1a1814', marginBottom: '8px' }}>
              {p.name || 'Your Name'}
            </h1>
            <p style={{ fontSize: '12px', color: '#7a7367', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{p.title}</p>
          </div>
          {p.photo && (
            <img src={p.photo} alt="profile" style={{ width: '70px', height: '70px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '14px' }}>
          {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: '11px', color: '#7a7367' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Body - single column */}
      <div style={{ padding: '8px 56px 40px' }}>
        {sections.personal?.visible !== false && p.summary && (
          <>
            <SectionTitle>Profile</SectionTitle>
            <p style={{ fontSize: '13px', lineHeight: 1.75, color: '#3a3830' }}>{p.summary}</p>
          </>
        )}

        {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
          <>
            <SectionTitle>Experience</SectionTitle>
            {sections.experience.data.map(exp => (
              <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0 20px', marginBottom: '20px' }}>
                <div style={{ paddingTop: '2px' }}>
                  <p style={{ fontSize: '10.5px', color: '#7a7367', lineHeight: 1.5 }}>{exp.startDate}<br />{exp.endDate ? `– ${exp.endDate}` : ''}</p>
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '13.5px', color: '#1a1814' }}>{exp.role}</p>
                  <p style={{ fontSize: '12px', color: accent, fontWeight: '500', marginBottom: '4px' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#3a3830', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
                </div>
              </div>
            ))}
          </>
        )}

        {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
          <>
            <SectionTitle>Education</SectionTitle>
            {sections.education.data.map(edu => (
              <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0 20px', marginBottom: '14px' }}>
                <p style={{ fontSize: '10.5px', color: '#7a7367', paddingTop: '2px' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a1814' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                  <p style={{ fontSize: '12px', color: '#7a7367' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {sections.skills?.visible !== false && (
          <>
            <SectionTitle>Skills</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0 20px' }}>
              {Object.entries(sections.skills.data).map(([cat, skills]) =>
                skills?.length > 0 ? (
                  <>
                    <p key={`${cat}-label`} style={{ fontSize: '10.5px', color: '#7a7367', paddingTop: '2px', textTransform: 'capitalize' }}>{cat}</p>
                    <p key={`${cat}-val`} style={{ fontSize: '12px', color: '#1a1814', marginBottom: '6px' }}>{skills.join(' · ')}</p>
                  </>
                ) : null
              )}
            </div>
          </>
        )}

        {sections.projects?.visible !== false && sections.projects?.data?.length > 0 && (
          <>
            <SectionTitle>Projects</SectionTitle>
            {sections.projects.data.map(proj => (
              <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0 20px', marginBottom: '14px' }}>
                {(proj.startDate || proj.endDate) ? (
                  <p style={{ fontSize: '10.5px', color: '#7a7367', paddingTop: '2px' }}>{proj.startDate}{proj.endDate ? `–${proj.endDate}` : ''}</p>
                ) : <div />}
                <div>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#1a1814' }}>{proj.name}</p>
                  {proj.technologies && <p style={{ fontSize: '11px', color: '#7a7367', fontStyle: 'italic', marginBottom: '3px' }}>{proj.technologies}</p>}
                  {proj.description && <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#3a3830' }}>{proj.description}</p>}
                </div>
              </div>
            ))}
          </>
        )}

        {sections.certifications?.visible !== false && sections.certifications?.data?.length > 0 && (
          <>
            <SectionTitle>Certifications</SectionTitle>
            {sections.certifications.data.map(cert => (
              <div key={cert.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0 20px', marginBottom: '10px' }}>
                <p style={{ fontSize: '10.5px', color: '#7a7367', paddingTop: '2px' }}>{cert.date}</p>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '12.5px' }}>{cert.name}</p>
                  <p style={{ fontSize: '11.5px', color: '#7a7367' }}>{cert.issuer}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
