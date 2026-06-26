import { Navigate, Route, Routes } from 'react-router-dom'
import CookieBanner from './components/ui/CookieBanner.jsx'
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
import UnlockDownload from './pages/UnlockDownload.jsx'
import ThankYou from './pages/ThankYou.jsx'

function PageMeta({ title, description, noindex, canonical }) {
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
  if (!robotsEl) {
    robotsEl = document.createElement('meta')
    robotsEl.name = 'robots'
    head.appendChild(robotsEl)
  }
  robotsEl.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')

  let canonicalEl = head.querySelector('link[rel="canonical"]')
  if (!canonicalEl) {
    canonicalEl = document.createElement('link')
    canonicalEl.rel = 'canonical'
    head.appendChild(canonicalEl)
  }
  canonicalEl.href = canonical || window.location.origin + window.location.pathname

  const setMeta = (selector, attr, value) => {
    let el = head.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      const match = selector.match(/\[(name|property)="([^"]+)"\]/)
      if (match) el.setAttribute(match[1], match[2])
      head.appendChild(el)
    }
    el.setAttribute(attr, value)
  }

  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:url"]', 'content', canonicalEl.href)
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)

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
  '/': { title: 'Free CV Builder Online - Create a Professional CV | CVCraft', description: 'Create a professional CV online with free ATS-friendly templates, live preview, cover letters, and PDF export. No signup required.', canonical: 'https://www.getcvcraft.com/' },
  '/cv-builder': { title: 'Free CV Builder Online - Professional CV Maker | CVCraft', description: 'Use CVCraft as a free online CV builder and CV maker. Choose ATS-friendly CV templates, customize your layout, and export your CV.', canonical: 'https://www.getcvcraft.com/cv-builder' },
  '/about': { title: 'About CVCraft', description: 'Learn about CVCraft, our mission, values, and the team behind the professional CV builder.' },
  '/contact': { title: 'Contact Us - CVCraft', description: 'Get in touch with the CVCraft team. We read every message and reply promptly.' },
  '/privacy-policy': { title: 'Privacy Policy - CVCraft', description: 'How CVCraft handles your data. Privacy-first CV builder that respects your information.' },
  '/terms-of-service': { title: 'Terms of Service - CVCraft', description: 'Terms of Service for using CVCraft CV and cover letter builder.' },
  '/cookie-policy': { title: 'Cookie Policy - CVCraft', description: 'Cookie Policy for CVCraft. Learn what data we store locally and how we handle cookies.' },
  '/cv-writing-guide': { title: 'How to Write a CV That Gets Interviews - CVCraft Guide', description: 'Complete guide to writing a professional CV with tips, examples, ATS advice, and common mistakes to avoid.' },
}

const NOINDEXED = {
  '/dashboard': { title: 'Dashboard - CVCraft', description: 'Manage your saved CV and cover letter documents.' },
  '/cv/:id': { title: 'CV Editor - CVCraft', description: 'Edit your CV with professional templates.' },
  '/unlock/:id': { title: 'Unlock CV Download - CVCraft', description: 'Choose a payment or ad-supported option to unlock your CV download.' },
  '/thank-you/:id': { title: 'Thank You - CVCraft', description: 'Your CV purchase has been completed.' },
  '/cover-letter/:id': { title: 'Cover Letter Editor - CVCraft', description: 'Edit your cover letter with AI assistance.' },
  '/report-issue': { title: 'Report an Issue - CVCraft', description: 'Report a bug or issue with CVCraft.' },
}

const INDEXED_PAGES = {
  '/': LandingPage,
  '/cv-builder': LandingPage,
  '/about': About,
  '/contact': Contact,
  '/privacy-policy': PrivacyPolicy,
  '/terms-of-service': TermsOfService,
  '/cookie-policy': CookiePolicy,
  '/cv-writing-guide': CvWritingGuide,
}

const NOINDEXED_PAGES = {
  '/dashboard': Dashboard,
  '/cv/:id': CVBuilder,
  '/unlock/:id': UnlockDownload,
  '/thank-you/:id': ThankYou,
  '/cover-letter/:id': CoverLetterBuilder,
  '/report-issue': ReportIssue,
}

export default function App() {
  return (
    <>
      <Routes>
        {Object.entries(INDEXED).map(([path, meta]) => {
          const Page = INDEXED_PAGES[path]
          return <Route key={path} path={path} element={<MetaPage meta={{ ...meta, noindex: false }} Page={Page} />} />
        })}
        {Object.entries(NOINDEXED).map(([path, meta]) => {
          const Page = NOINDEXED_PAGES[path]
          return <Route key={path} path={path} element={<MetaPage meta={{ ...meta, noindex: true }} Page={Page} />} />
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
    </>
  )
}
