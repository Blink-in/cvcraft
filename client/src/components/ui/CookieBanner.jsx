import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'cvcraft_cookie_consent'

export default function CookieBanner() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show banner if user has not yet consented
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      // Slight delay so the page loads first
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
    // Optionally: disable personalised ads here via consent mode
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage:            'denied',
        analytics_storage:     'denied',
        ad_personalization:    'denied',
        ad_user_data:          'denied',
      })
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-slide-up"
    >
      <div className="card p-4 shadow-2xl border border-obsidian-700">
        <div className="flex items-start gap-3 mb-3">
          <Cookie size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-obsidian-100 mb-1">We use cookies</p>
            <p className="text-xs text-obsidian-400 leading-relaxed">
              CVCraft uses cookies to save your work and to display ads via Google AdSense that help keep this tool free.{' '}
              <button
                onClick={() => navigate('/cookie-policy')}
                className="text-amber-400 hover:underline"
              >
                Cookie Policy
              </button>
              {' '}·{' '}
              <button
                onClick={() => navigate('/privacy-policy')}
                className="text-amber-400 hover:underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
          <button onClick={decline} className="text-obsidian-600 hover:text-obsidian-400 flex-shrink-0 -mt-0.5">
            <X size={14} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 btn-primary py-2 text-xs"
          >
            Accept All
          </button>
          <button
            onClick={decline}
            className="flex-1 btn-secondary py-2 text-xs"
          >
            Decline Ads
          </button>
        </div>
      </div>
    </div>
  )
}
