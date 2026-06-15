function parseHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
}

export default function ModernTemplate({ cv }) {
  const { sections, customization: c } = cv
  const p = sections.personal?.data || {}
  const accent = c?.accentColor || '#3b82f6'
  const primary = c?.primaryColor || '#0f172a'

  const Divider = () => <div style={{ height: '1px', background: '#e2e8f0', margin: '16px 0' }} />

  const SectionTitle = ({ children }) => (
    <h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', color: accent, marginBottom: '14px', paddingBottom: '6px', borderBottom: `2px solid ${accent}` }}>
      {children}
    </h3>
  )

  return (
    <div style={{ background: '#ffffff', color: '#1e293b', fontFamily: 'inherit', minHeight: '1122px', fontSize: 'inherit' }}>
      {/* Header */}
      <div style={{ background: primary, padding: '40px 48px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: `${accent}15` }} />
        <div style={{ position: 'absolute', right: '40px', bottom: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: `${accent}08` }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
          {p.photo && (
            <img src={p.photo} alt="profile" style={{ width: '76px', height: '76px', borderRadius: '8px', objectFit: 'cover', border: `2px solid ${accent}`, flexShrink: 0 }} />
          )}
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '38px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{p.name || 'Your Name'}</h1>
            <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: accent, margin: '6px 0 14px', opacity: 0.9 }}>{p.title}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
              {[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).map((item, i) => (
                <span key={i} style={{ fontSize: '11px', color: '#94a3b8' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body: two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px' }}>
        <div style={{ padding: '28px 36px', borderRight: '1px solid #e2e8f0' }}>
          {sections.personal?.visible !== false && p.summary && (
            <div style={{ marginBottom: '4px' }}>
              <SectionTitle>About Me</SectionTitle>
              <p style={{ fontSize: '12.5px', lineHeight: 1.75, color: '#334155' }}>{p.summary}</p>
            </div>
          )}

          {sections.experience?.visible !== false && sections.experience?.data?.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <SectionTitle>Experience</SectionTitle>
              {sections.experience.data.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: '20px', paddingLeft: '12px', borderLeft: `2px solid ${i === 0 ? accent : '#e2e8f0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{exp.role}</p>
                      <p style={{ fontSize: '12px', color: accent, fontWeight: '500' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '10px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  </div>
                  {exp.description && <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#475569', marginTop: '6px', whiteSpace: 'pre-wrap' }}>{parseHtml(exp.description)}</p>}
                </div>
              ))}
            </div>
          )}

          {sections.projects?.visible !== false && sections.projects?.data?.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <SectionTitle>Projects</SectionTitle>
              {sections.projects.data.map(proj => (
                <div key={proj.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{proj.name}</p>
                  {proj.technologies && <p style={{ fontSize: '10.5px', color: '#64748b', margin: '2px 0 4px', fontStyle: 'italic' }}>{proj.technologies}</p>}
                  {proj.description && <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ padding: '28px 24px', background: '#f8fafc' }}>
          {sections.education?.visible !== false && sections.education?.data?.length > 0 && (
            <div>
              <SectionTitle>Education</SectionTitle>
              {sections.education.data.map(edu => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: '600', fontSize: '12px', color: '#1e293b' }}>{edu.degree}</p>
                  <p style={{ fontSize: '11.5px', color: accent }}>{edu.school}</p>
                  <p style={{ fontSize: '10.5px', color: '#64748b' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                </div>
              ))}
            </div>
          )}

{sections.skills?.visible !== false && (
             <div style={{ marginTop: '16px' }}>
               <SectionTitle>Skills</SectionTitle>
               <div style={{ display: 'flex', gap: '16px' }}>
                 {sections.skills.data.technical?.length > 0 && (
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '5px' }}>Technical</p>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                       {sections.skills.data.technical.map(s => (
                         <span key={s} style={{ fontSize: '10.5px', padding: '3px 8px', background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: '4px', color: '#1e293b' }}>
                           {s}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
                 {sections.skills.data.languages?.length > 0 && (
                   <div style={{ flex: 1 }}>
                     <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '5px' }}>Languages</p>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                       {sections.skills.data.languages.map(s => (
                         <span key={s} style={{ fontSize: '10.5px', padding: '3px 8px', background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: '4px', color: '#1e293b' }}>
                           {s}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
               {sections.skills.data.soft?.length > 0 && (
                 <div style={{ marginTop: '12px' }}>
                   <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '5px' }}>Soft Skills</p>
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                     {sections.skills.data.soft.map(s => (
                       <span key={s} style={{ fontSize: '10.5px', padding: '3px 8px', background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: '4px', color: '#1e293b' }}>
                         {s}
                       </span>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           )}

          {sections.certifications?.visible !== false && sections.certifications?.data?.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <SectionTitle>Certifications</SectionTitle>
              {sections.certifications.data.map(cert => (
                <div key={cert.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '600', fontSize: '11.5px', color: '#1e293b' }}>{cert.name}</p>
                  <p style={{ fontSize: '10.5px', color: accent }}>{cert.issuer}</p>
                  {cert.date && <p style={{ fontSize: '10px', color: '#64748b' }}>{cert.date}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
