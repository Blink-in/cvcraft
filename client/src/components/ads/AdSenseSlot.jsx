import { useEffect, useMemo } from 'react'

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID

function loadAdSenseScript(clientId) {
  if (!clientId) return
  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
  if (document.querySelector(`script[src="${src}"]`)) return

  const script = document.createElement('script')
  script.async = true
  script.src = src
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

export default function AdSenseSlot({ slot, format = 'auto', fullWidthResponsive = true, className = '' }) {
  const enabled = Boolean(CLIENT_ID && slot)
  const adKey = useMemo(() => `${slot || 'pending'}-${format}`, [slot, format])

  useEffect(() => {
    if (!enabled) return
    loadAdSenseScript(CLIENT_ID)
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ad blockers or pending approval can prevent rendering. The page content remains usable.
    }
  }, [enabled, adKey])

  if (!enabled) {
    return (
      <div className={`rounded-lg border border-dashed border-obsidian-700 bg-obsidian-900/60 p-6 text-center ${className}`}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-obsidian-600">Advertisement</p>
        <p className="mt-2 text-xs text-obsidian-500">Ads are not configured for this environment.</p>
      </div>
    )
  }

  return (
    <div className={className} aria-label="Advertisement">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-obsidian-600">Advertisement</p>
      <ins
        key={adKey}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: 250 }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
