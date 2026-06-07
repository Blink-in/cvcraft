// Lightweight initializer that exposes `window.CVCraftRewardedAd.show()`
// - If VITE_GAM_REWARDED_TAG (or window.CVCraftAdTagUrl) is provided, it will try to load Google IMA SDK and request a rewarded ad.
// - If no tag or if the SDK fails, it falls back to a 60s wait to simulate a rewarded view.

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load script ' + src))
    document.head.appendChild(s)
  })
}

async function fallbackWait60() {
  return new Promise(resolve => setTimeout(() => resolve(true), 60000))
}

export function initRewardedAd() {
  const adTag = (import.meta.env && import.meta.env.VITE_GAM_REWARDED_TAG) || window.CVCraftAdTagUrl
  const adEnabled = Boolean(adTag)
  window.CVCraftRewardedAdAvailable = adEnabled
  window.CVCraftRewardedAd = window.CVCraftRewardedAd || {
    show: async () => {
      if (!adEnabled) {
        throw new Error('Rewarded ads are not configured yet.')
      }

      // Try to load IMA SDK
      try {
        await loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js')
      } catch (e) {
        return await fallbackWait60()
      }

      // Minimal IMA rewarded implementation — best-effort. If anything fails, fallback to 60s.
      try {
        const google = window.google
        if (!google || !google.ima) return await fallbackWait60()

        return await new Promise((resolve) => {
          const adContainer = document.createElement('div')
          adContainer.style.position = 'fixed'
          adContainer.style.inset = '0'
          adContainer.style.zIndex = '9999'
          adContainer.style.background = 'rgba(0,0,0,0.85)'

          const video = document.createElement('video')
          video.style.width = '100%'
          video.style.height = '100%'
          video.style.maxWidth = '900px'
          video.style.maxHeight = '600px'
          video.controls = false

          const inner = document.createElement('div')
          inner.style.display = 'flex'
          inner.style.alignItems = 'center'
          inner.style.justifyContent = 'center'
          inner.style.height = '100%'
          inner.appendChild(video)

          adContainer.appendChild(inner)
          document.body.appendChild(adContainer)

          const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, video)
          const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

          let startedAt = null

          adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (adsManagerLoadedEvent) => {
              const adsManager = adsManagerLoadedEvent.getAdsManager(video)

              adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => {
                startedAt = Date.now()
              })

              adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
                const elapsed = startedAt ? (Date.now() - startedAt) / 1000 : 0
                // Require at least 60 seconds watched to consider rewarded
                const success = elapsed >= 60
                try { adsManager.destroy() } catch {}
                document.body.removeChild(adContainer)
                resolve(success)
              })

              adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, () => {
                try { adsManager.destroy() } catch {}
                document.body.removeChild(adContainer)
                resolve(false)
              })

              adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => {
                try { adsManager.destroy() } catch {}
                document.body.removeChild(adContainer)
                resolve(false)
              })

              try {
                adsManager.init(window.innerWidth, window.innerHeight, google.ima.ViewMode.FULLSCREEN)
                adsManager.start()
              } catch (err) {
                try { adsManager.destroy() } catch {}
                document.body.removeChild(adContainer)
                resolve(false)
              }
            }
          )

          adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => {
            try { document.body.removeChild(adContainer) } catch {}
            resolve(false)
          })

          // Initialize and request ads
          adDisplayContainer.initialize()
          const adsRequest = new google.ima.AdsRequest()
          adsRequest.adTagUrl = adTag
          adsRequest.linearAdSlotWidth = window.innerWidth
          adsRequest.linearAdSlotHeight = window.innerHeight
          adsRequest.nonLinearAdSlotWidth = window.innerWidth
          adsRequest.nonLinearAdSlotHeight = window.innerHeight / 3

          adsLoader.requestAds(adsRequest)

          // Safety timeout: if nothing happens within 10s, fallback to 60s wait
          setTimeout(async () => {
            if (document.body.contains(adContainer)) {
              try { document.body.removeChild(adContainer) } catch {}
              const res = await fallbackWait60()
              resolve(res)
            }
          }, 10000)
        })
      } catch (err) {
        return await fallbackWait60()
      }
    }
  }
}

export default initRewardedAd
