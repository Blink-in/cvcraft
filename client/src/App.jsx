import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CVBuilder from './pages/CVBuilder.jsx'
import CoverLetterBuilder from './pages/CoverLetterBuilder.jsx'
import ReportIssue from './pages/ReportIssue.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cv/:id" element={<CVBuilder />} />
      <Route path="/cover-letter/:id" element={<CoverLetterBuilder />} />
      <Route path="/report-issue" element={<ReportIssue />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
