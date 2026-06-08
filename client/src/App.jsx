import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CVBuilder from './pages/CVBuilder.jsx'
import CoverLetterBuilder from './pages/CoverLetterBuilder.jsx'
import ReportIssue from './pages/ReportIssue.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import CvWritingGuide from './pages/CvWritingGuide.jsx'

function PageMeta({ title, description, noindex }) {
  const head = document.head
  let titleEl = head.querySelector('title')
  if (!titleEl) {
    titleEl = document.createElement('title')
    head.appendChild(titleEl)
  }
  titleEl.textContent = title

  let descEl = head.querySelector('meta[name="description"]')
  if (!descEl) {
    descEl = document.createElement('meta')
    descEl.name = 'description'
    head.appendChild(descEl)
  }
  descEl.setAttribute('content', description)

  let robotsEl = head.querySelector('meta[name="robots"]')
  if (noindex) {
    if (!robotsEl) {
      robotsEl = document.createElement('meta')
      robotsEl.name = 'robots'
      head.appendChild(robotsEl)
    }
    robotsEl.setAttribute('content', 'noindex, nofollow')
  } else if (robotsEl) {
    robotsEl.setAttribute('content', 'index, follow')
  }

  return null
}

function MetaPage({ meta, Page }) {
  return (
    <>
      <PageMeta {...meta} />
      <Page />
    </>
  )
}

const INDEXED = {
  '/': { title: 'CVCraft — Professional CV & Cover Letter Builder', description: 'Create stunning, ATS-optimized CVs and cover letters in minutes. No signup required.' },
  '/about': { title: 'About CVCraft', description: 'Learn about CVCraft — our mission, values, and the team behind the professional CV builder.' },
  '/contact': { title: 'Contact Us — CVCraft', description: 'Get in touch with the CVCraft team. We read every message and reply promptly.' },
  '/privacy-policy': { title: 'Privacy Policy — CVCraft', description: 'How CVCraft handles your data. Privacy-first CV builder that respects your information.' },
  '/terms-of-service': { title: 'Terms of Service — CVCraft', description: 'Terms of Service for using CVCraft CV and cover letter builder.' },
  '/cookie-policy': { title: 'Cookie Policy — CVCraft', description: 'Cookie Policy for CVCraft. Learn what data we store locally and how we handle cookies.' },
  '/cv-writing-guide': { title: 'How to Write a CV That Gets Interviews — CVCraft Guide', description: 'Complete guide to writing a professional CV with tips, examples, ATS advice, and common mistakes to avoid.' },
}

const NOINDEXED = {
  '/dashboard': { title: 'Dashboard — CVCraft', description: 'Manage your saved CV and cover letter documents.' },
  '/cv/:id': { title: 'CV Editor — CVCraft', description: 'Edit your CV with professional templates.' },
  '/cover-letter/:id': { title: 'Cover Letter Editor — CVCraft', description: 'Edit your cover letter with AI assistance.' },
  '/report-issue': { title: 'Report an Issue — CVCraft', description: 'Report a bug or issue with CVCraft.' },
}

export default function App() {
  return (
    <Routes>
      {Object.entries(INDEXED).map(([path, meta]) => {
        const Page = { '/': LandingPage, '/about': About, '/contact': Contact, '/privacy-policy': PrivacyPolicy, '/terms-of-service': TermsOfService, '/cookie-policy': CookiePolicy, '/cv-writing-guide': CvWritingGuide }[path]
        return <Route key={path} path={path} element={<MetaPage meta={{ ...meta, noindex: false }} Page={Page} />} />
      })}
      {Object.entries(NOINDEXED).map(([path, meta]) => {
        const Page = { '/dashboard': Dashboard, '/cv/:id': CVBuilder, '/cover-letter/:id': CoverLetterBuilder, '/report-issue': ReportIssue }[path]
        return <Route key={path} path={path} element={<MetaPage meta={{ ...meta, noindex: true }} Page={Page} />} />
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
