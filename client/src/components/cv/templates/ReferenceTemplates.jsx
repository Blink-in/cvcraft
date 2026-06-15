const A4_HEIGHT = 1122

function parseHtml(html) {
  if (!html) return ''
  return html
    .replace(/<strong>(.*?)<\/strong>/gi, '$1')
    .replace(/<em>(.*?)<\/em>/gi, '$1')
    .replace(/<u>(.*?)<\/u>/gi, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function textLines(text) {
  return parseHtml(text)
    .split(/\n+/)
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
}

function textWeight(value, base = 1) {
  return base + Math.ceil(String(value || '').length / 95)
}

function dateRange(item, separator = ' - ') {
  return [item.startDate, item.endDate || (item.current ? 'Current' : '')].filter(Boolean).join(separator)
}

function contactItems(p) {
  return [
    p.email,
    p.phone,
    p.location,
    p.linkedin,
    p.website,
  ].filter(Boolean)
}

function splitSkills(sections) {
  const data = sections.skills?.data || {}
  return {
    technical: data.technical || [],
    soft: data.soft || [],
    languages: data.languages || [],
  }
}

function paginate(blocks, firstLimit, nextLimit = firstLimit + 2) {
  const pages = []
  let current = []
  let used = 0
  let limit = firstLimit

  blocks.forEach(block => {
    const blockWeight = Math.min(block.weight || 1, limit)
    if (current.length && used + blockWeight > limit) {
      pages.push(current)
      current = []
      used = 0
      limit = nextLimit
    }
    current.push(block)
    used += blockWeight
  })

  if (current.length) pages.push(current)
  return pages.length ? pages : [[]]
}

function buildBlocks(cv, style) {
  const { sections } = cv
  const p = sections.personal?.data || {}
  const skills = splitSkills(sections)
  const blocks = []

  if (sections.personal?.visible !== false && p.summary) {
    blocks.push({
      key: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      weight: textWeight(p.summary, 2),
      body: <p style={style.body}>{p.summary}</p>,
    })
  }

  if (sections.experience?.visible !== false) {
    sections.experience?.data?.filter(exp => exp.role || exp.company || exp.description).forEach((exp, index) => {
      const lines = textLines(exp.description)
      blocks.push({
        key: `experience-${exp.id}`,
        type: index === 0 ? 'experience-start' : 'experience',
        title: index === 0 ? 'Experience' : null,
        weight: textWeight(exp.description, 3) + lines.length,
        body: (
          <div style={style.entry}>
            <div style={style.entryTop}>
              <div>
                <p style={style.role}>{exp.role || 'Role'}</p>
                <p style={style.meta}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
              </div>
              {dateRange(exp) && <p style={style.date}>{dateRange(exp)}</p>}
            </div>
            {lines.length > 0 && (
              <ul style={style.list}>
                {lines.map(line => <li key={line}>{line}</li>)}
              </ul>
            )}
          </div>
        ),
      })
    })
  }

  if (sections.education?.visible !== false) {
    sections.education?.data?.filter(edu => edu.degree || edu.school || edu.description).forEach((edu, index) => {
      blocks.push({
        key: `education-${edu.id}`,
        type: index === 0 ? 'education-start' : 'education',
        title: index === 0 ? 'Education' : null,
        weight: textWeight(edu.description, 2),
        body: (
          <div style={style.entry}>
            <div style={style.entryTop}>
              <div>
                <p style={style.role}>{edu.degree || 'Degree'}{edu.field ? `, ${edu.field}` : ''}</p>
                <p style={style.meta}>{edu.school}</p>
              </div>
              {dateRange(edu) && <p style={style.date}>{dateRange(edu)}</p>}
            </div>
            {edu.grade && <p style={style.note}>Grade: {edu.grade}</p>}
            {edu.description && <p style={style.body}>{parseHtml(edu.description)}</p>}
          </div>
        ),
      })
    })
  }

  if (sections.skills?.visible !== false && (skills.technical.length || skills.soft.length)) {
    blocks.push({
      key: 'skills',
      type: 'skills',
      title: 'Skills',
      weight: 2 + Math.ceil((skills.technical.length + skills.soft.length) / 6),
      body: (
        <div style={style.skillGrid}>
          {skills.technical.length > 0 && <SkillGroup label="Technical Skills" skills={skills.technical} style={style} />}
          {skills.soft.length > 0 && <SkillGroup label="Soft Skills" skills={skills.soft} style={style} />}
        </div>
      ),
    })
  }

  if (sections.skills?.visible !== false && skills.languages.length) {
    blocks.push({
      key: 'languages',
      type: 'languages',
      title: 'Languages',
      weight: 2 + Math.ceil(skills.languages.length / 7),
      body: <SkillGroup label="Languages" skills={skills.languages} style={style} />,
    })
  }

  if (sections.projects?.visible !== false) {
    sections.projects?.data?.filter(project => project.name || project.description).forEach((project, index) => {
      blocks.push({
        key: `project-${project.id}`,
        type: index === 0 ? 'projects-start' : 'projects',
        title: index === 0 ? 'Projects' : null,
        weight: textWeight(project.description, 2),
        body: (
          <div style={style.entry}>
            <div style={style.entryTop}>
              <div>
                <p style={style.role}>{project.name || 'Project'}</p>
                {project.technologies && <p style={style.meta}>{project.technologies}</p>}
              </div>
              {dateRange(project) && <p style={style.date}>{dateRange(project)}</p>}
            </div>
            {project.url && <p style={style.note}>{project.url}</p>}
            {project.description && <p style={style.body}>{parseHtml(project.description)}</p>}
          </div>
        ),
      })
    })
  }

  if (sections.certifications?.visible !== false) {
    sections.certifications?.data?.filter(cert => cert.name || cert.description).forEach((cert, index) => {
      blocks.push({
        key: `cert-${cert.id}`,
        type: index === 0 ? 'certifications-start' : 'certifications',
        title: index === 0 ? 'Certifications' : null,
        weight: textWeight(cert.description, 2),
        body: (
          <div style={style.entry}>
            <div style={style.entryTop}>
              <div>
                <p style={style.role}>{cert.name || 'Certification'}</p>
                {cert.issuer && <p style={style.meta}>{cert.issuer}</p>}
              </div>
              {cert.date && <p style={style.date}>{cert.date}</p>}
            </div>
            {cert.url && <p style={style.note}>{cert.url}</p>}
            {cert.description && <p style={style.body}>{parseHtml(cert.description)}</p>}
          </div>
        ),
      })
    })
  }

  return blocks
}

function SkillGroup({ label, skills, style }) {
  return (
    <div style={style.skillGroup}>
      <p style={style.skillLabel}>{label}</p>
      <div style={style.chips}>
        {skills.map(skill => <span key={skill} style={style.chip}>{skill}</span>)}
      </div>
    </div>
  )
}

function PageStack({ pages, renderPage, gap = 28 }) {
  return (
    <div style={{ display: 'grid', gap: `${gap}px`, background: 'transparent' }}>
      {pages.map((blocks, index) => renderPage(blocks, index))}
    </div>
  )
}

function renderBlocks(blocks, SectionTitle) {
  return blocks.map(block => (
    <section key={block.key} style={{ breakInside: 'avoid', marginBottom: '16px' }}>
      {block.title && <SectionTitle>{block.title}</SectionTitle>}
      {block.body}
    </section>
  ))
}

function firstNameLines(name) {
  return (name || 'Your Name').split(' ').map((part, index) => <span key={index}>{part}<br /></span>)
}

export function CleanFlowTemplate({ cv }) {
  const p = cv.sections.personal?.data || {}
  const accent = cv.customization?.accentColor || '#222831'
  const style = cleanStyle(accent)
  const pages = paginate(buildBlocks(cv, style), 28, 33)

  const SectionTitle = ({ children }) => (
    <h3 style={style.sectionTitle}>{children}</h3>
  )

  return (
    <PageStack
      pages={pages}
      renderPage={(blocks, index) => (
        <div key={index} style={style.page}>
          {index === 0 ? (
            <header style={style.header}>
              {p.photo && <img src={p.photo} alt="profile" style={style.photo} />}
              <div>
                <h1 style={style.name}>{firstNameLines(p.name)}</h1>
                {p.title && <p style={style.title}>{p.title}</p>}
                <div style={style.contact}>{contactItems(p).map(item => <span key={item}>{item}</span>)}</div>
              </div>
            </header>
          ) : (
            <ContinuationHeader name={p.name} style={style} />
          )}
          {renderBlocks(blocks, SectionTitle)}
        </div>
      )}
    />
  )
}

export function SimpleLinearTemplate({ cv }) {
  const p = cv.sections.personal?.data || {}
  const style = linearStyle()
  const pages = paginate(buildBlocks(cv, style), 34, 39)

  const SectionTitle = ({ children }) => (
    <h3 style={style.sectionTitle}>{children}</h3>
  )

  return (
    <PageStack
      pages={pages}
      renderPage={(blocks, index) => (
        <div key={index} style={style.page}>
          {index === 0 ? (
            <header style={style.header}>
              {p.photo && <img src={p.photo} alt="profile" style={style.photo} />}
              <div>
                <h1 style={style.name}>
                  {p.name?.split(' ').slice(0, -1).join(' ') || 'Your'} <strong>{p.name?.split(' ').slice(-1)[0] || 'Name'}</strong>
                </h1>
                {p.title && <p style={style.title}>{p.title}</p>}
                <p style={style.contact}>{contactItems(p).join(' | ')}</p>
              </div>
            </header>
          ) : (
            <ContinuationHeader name={p.name} style={style} />
          )}
          {renderBlocks(blocks, SectionTitle)}
        </div>
      )}
    />
  )
}

export function TimelessSleekTemplate({ cv }) {
  const p = cv.sections.personal?.data || {}
  const accent = cv.customization?.accentColor || '#b7a29b'
  const style = sleekStyle(accent)
  const pages = paginate(buildBlocks(cv, style), 28, 34)

  const SectionTitle = ({ children }) => (
    <h3 style={style.sectionTitle}>{children}</h3>
  )

  return (
    <PageStack
      pages={pages}
      renderPage={(blocks, index) => (
        <div key={index} style={style.page}>
          {index === 0 ? (
            <header style={style.header}>
              <div>
                <h1 style={style.name}>{firstNameLines(p.name)}</h1>
                {p.title && <p style={style.title}>{p.title}</p>}
              </div>
              <div style={style.headerRight}>
                {p.photo && <img src={p.photo} alt="profile" style={style.photo} />}
                {contactItems(p).map(item => <div key={item}>{item}</div>)}
              </div>
            </header>
          ) : (
            <ContinuationHeader name={p.name} style={style} />
          )}
          {renderBlocks(blocks, SectionTitle)}
        </div>
      )}
    />
  )
}

export function ModernOverlayTemplate({ cv }) {
  const p = cv.sections.personal?.data || {}
  const accent = cv.customization?.accentColor || '#546874'
  const style = overlayStyle(accent)
  const pages = paginate(buildBlocks(cv, style), 31, 36)
  const sideBlocks = buildSideBlocks(cv, style)

  const SectionTitle = ({ children }) => (
    <h3 style={style.sectionTitle}>{children}</h3>
  )

  return (
    <PageStack
      pages={pages}
      gap={30}
      renderPage={(blocks, index) => (
        <div key={index} style={style.outerPage}>
          <div style={style.innerPage}>
            <aside style={style.aside}>
              {index === 0 ? (
                <>
                  {p.photo && <img src={p.photo} alt="profile" style={style.photo} />}
                  {contactItems(p).map(item => <p key={item} style={style.sideContact}>{item}</p>)}
                  {sideBlocks}
                </>
              ) : (
                <p style={style.sideContact}>{p.name || 'Continued'}</p>
              )}
            </aside>
            <main style={style.main}>
              {index === 0 ? (
                <>
                  <h1 style={style.name}>{p.name || 'Your Name'}</h1>
                  {p.title && <p style={style.title}>{p.title}</p>}
                </>
              ) : (
                <ContinuationHeader name={p.name} style={style} />
              )}
              {renderBlocks(blocks, SectionTitle)}
            </main>
          </div>
        </div>
      )}
    />
  )
}

function ContinuationHeader({ name, style }) {
  return (
    <header style={style.continuation}>
      <strong>{name || 'CV'}</strong>
      <span>Continued</span>
    </header>
  )
}

function buildSideBlocks(cv, style) {
  const { sections } = cv
  const skills = splitSkills(sections)
  const blocks = []

  if (sections.skills?.visible !== false && (skills.technical.length || skills.soft.length)) {
    blocks.push(<SkillGroup key="side-skills" label="Skills" skills={[...skills.technical, ...skills.soft]} style={style} />)
  }

  if (sections.skills?.visible !== false && skills.languages.length) {
    blocks.push(<SkillGroup key="side-languages" label="Languages" skills={skills.languages} style={style} />)
  }

  return <>{blocks}</>
}

function basePage(extra = {}) {
  return {
    width: '794px',
    minHeight: `${A4_HEIGHT}px`,
    background: '#fff',
    color: '#111',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    ...extra,
  }
}

function cleanStyle(accent) {
  return {
    page: basePage({ padding: '48px 50px', lineHeight: 1.5 }),
    header: { display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '24px' },
    continuation: continuationStyle(accent),
    photo: { width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}`, flexShrink: 0 },
    name: { fontSize: '34px', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.6px', textTransform: 'uppercase', color: '#252525' },
    title: { marginTop: '6px', fontSize: '13px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '1.2px' },
    contact: { display: 'flex', flexWrap: 'wrap', gap: '10px 16px', marginTop: '10px', fontSize: '11.5px', color: '#333' },
    sectionTitle: { fontSize: '12px', fontWeight: 900, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '20px 0 8px', color: '#111', borderBottom: `1px solid ${accent}55`, paddingBottom: '4px' },
    entry: { marginBottom: '10px' },
    entryTop: { display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start' },
    role: { fontSize: '12.5px', fontWeight: 900, color: '#111' },
    meta: { fontSize: '11.5px', fontWeight: 700, color: accent },
    date: { fontSize: '11px', color: '#555', whiteSpace: 'nowrap', textAlign: 'right' },
    body: { fontSize: '12px', lineHeight: 1.55, color: '#272727' },
    note: { fontSize: '11px', lineHeight: 1.45, color: '#555', marginTop: '3px' },
    list: { margin: '5px 0 0 18px', fontSize: '11.5px', lineHeight: 1.5, color: '#272727' },
    skillGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 28px' },
    skillGroup: { marginBottom: '8px' },
    skillLabel: { fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: accent, marginBottom: '6px' },
    chips: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    chip: { fontSize: '11px', padding: '3px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', color: '#222' },
  }
}

function linearStyle() {
  const accent = '#111'
  return {
    ...cleanStyle(accent),
    page: basePage({ padding: '34px 52px', lineHeight: 1.35, fontFamily: 'Arial, Helvetica, sans-serif' }),
    header: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', padding: '10px 0 12px', marginBottom: '14px' },
    photo: { width: '54px', height: '54px', borderRadius: '4px', objectFit: 'cover' },
    name: { fontSize: '23px', lineHeight: 1, fontWeight: 400, textTransform: 'uppercase', color: '#111' },
    title: { marginTop: '5px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' },
    contact: { fontSize: '10px', marginTop: '7px', color: '#111' },
    sectionTitle: { borderTop: '1px solid #cfcfcf', borderBottom: '1px solid #cfcfcf', textAlign: 'center', fontSize: '11.5px', fontWeight: 900, padding: '4px 0', margin: '12px 0 7px', textTransform: 'capitalize' },
    role: { fontSize: '11.8px', fontWeight: 900, color: '#111' },
    meta: { fontSize: '10.8px', fontWeight: 700, color: '#111' },
    date: { fontSize: '10.8px', color: '#111', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 700 },
    body: { fontSize: '11.2px', lineHeight: 1.42, color: '#111' },
    list: { margin: '4px 0 0 18px', fontSize: '11px', lineHeight: 1.35, color: '#111' },
  }
}

function sleekStyle(accent) {
  return {
    ...cleanStyle(accent),
    page: basePage({ padding: '40px 46px', lineHeight: 1.5 }),
    header: { background: accent, color: 'white', padding: '20px 26px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '22px', marginBottom: '24px' },
    headerRight: { textAlign: 'right', fontSize: '10.5px', lineHeight: 1.7 },
    photo: { width: '62px', height: '62px', borderRadius: '50%', objectFit: 'cover', marginLeft: 'auto', marginBottom: '8px', border: '2px solid white' },
    name: { fontSize: '32px', lineHeight: 1.08, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' },
    title: { marginTop: '8px', fontSize: '12px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase' },
    sectionTitle: { fontSize: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', color: accent, margin: '20px 0 9px', borderBottom: `1px solid ${accent}55`, paddingBottom: '5px' },
  }
}

function overlayStyle(accent) {
  const base = cleanStyle(accent)
  return {
    ...base,
    outerPage: basePage({ padding: '24px', background: accent }),
    innerPage: { minHeight: '1074px', background: 'white', padding: '34px 30px', display: 'grid', gridTemplateColumns: '170px 1fr', gap: '30px', border: '8px solid white' },
    aside: { fontSize: '10.5px', lineHeight: 1.45, color: '#222' },
    main: { borderLeft: `4px solid ${accent}`, paddingLeft: '20px' },
    sideContact: { fontSize: '10.5px', fontWeight: 800, marginBottom: '5px', overflowWrap: 'anywhere' },
    photo: { width: '82px', height: '82px', borderRadius: '4px', objectFit: 'cover', marginBottom: '14px' },
    name: { fontSize: '35px', fontWeight: 500, color: '#454545', lineHeight: 1.05, marginBottom: '4px' },
    title: { fontSize: '12px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', color: accent, marginBottom: '26px' },
    sectionTitle: { fontSize: '14px', fontWeight: 900, color: '#333', margin: '20px 0 9px' },
    skillGrid: { display: 'grid', gap: '10px' },
    skillLabel: { fontSize: '11px', fontWeight: 900, color: '#333', margin: '18px 0 6px' },
    chips: { display: 'grid', gap: '3px' },
    chip: { fontSize: '10.5px', color: '#222' },
  }
}

function continuationStyle(accent) {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: accent,
    borderBottom: `1px solid ${accent}55`,
    paddingBottom: '8px',
    marginBottom: '18px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }
}
