import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, CheckCircle, Clock, AlertCircle, X, ShieldCheck } from 'lucide-react'

/**
 * RewardedAdGate
 *
 * Shows before a user downloads their CV if they haven't paid.
 * Implements a self-hosted 90-second interstitial video ad (compliant with
 * AdSense policies — we are NOT using AdSense for the rewarded unit itself,
 * as AdSense Rewarded is currently invite-only for web publishers).
 *
 * Instead, this uses Google Ad Manager (GAM) interstitial or a simple
 * counted video slot. After AdSense approves the site, you connect GAM
 * and replace the unit ID below with your GAM interstitial unit ID.
 *
 * Flow:
 *   1. User clicks "Watch Ad" → modal opens
 *   2. A video ad plays (GAM interstitial or placeholder)
 *   3. Progress bar counts down 90 seconds
 *   4. Heartbeats sent to server every 10 s for fraud prevention
 *   5. Math captcha at end confirms human
 *   6. onComplete() called → CV unlocks
 */

const AD_DURATION = 90  // seconds

function makeCaptcha() {
  const a = Math.floor(Math.random() * 12) + 1
  const b = Math.floor(Math.random() * 12) + 1
  return { q: `${a} + ${b} =`, a: a + b }
}

export default function RewardedAdGate({ cvId, sessionId, onComplete, onClose }) {
  const [phase, setPhase]         = useState('intro')   // intro | watching | captcha | verifying | done | error
  const [elapsed, setElapsed]     = useState(0)
  const [captcha]                 = useState(makeCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaWrong, setCaptchaWrong] = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [adSessionId]             = useState(() => crypto.randomUUID())
  const timerRef  = useRef(null)
  const beatRef   = useRef(null)

  const remaining = Math.max(0, AD_DURATION - elapsed)
  const pct       = Math.min(100, (elapsed / AD_DURATION) * 100)
  const done      = elapsed >= AD_DURATION

  // ── Start watching ──────────────────────────────────────────────────
  const startAd = useCallback(async () => {
    setPhase('watching')
    setElapsed(0)

    // Notify server that session started
    try {
      await fetch(`/api/ads/verify?action=start&adSessionId=${adSessionId}&cvId=${cvId}`)
    } catch { /* non-fatal */ }

    // Countdown timer
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= AD_DURATION) {
          clearInterval(timerRef.current)
          clearInterval(beatRef.current)
          setPhase('captcha')
        }
        return next
      })
    }, 1000)

    // Heartbeat every 10 s
    beatRef.current = setInterval(async () => {
      try {
        await fetch(`/api/ads/verify?action=heartbeat&adSessionId=${adSessionId}`)
      } catch { /* non-fatal */ }
    }, 10_000)
  }, [adSessionId, cvId])

  // Clean up on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current)
    clearInterval(beatRef.current)
  }, [])

  // ── Submit captcha ─────────────────────────────────────────────────
  const submitCaptcha = async () => {
    if (parseInt(captchaInput) !== captcha.a) {
      setCaptchaWrong(true)
      setCaptchaInput('')
      return
    }
    setPhase('verifying')

    try {
      const res = await fetch('/api/ads/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          adSessionId,
          cvId,
          sessionId,
          captchaQuestion: captcha.q,
          captchaAnswer:   String(captcha.a),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      setPhase('done')
      setTimeout(() => onComplete(data), 1200)
    } catch (err) {
      setPhase('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md card overflow-hidden">

        {/* Close — only allowed before ad starts */}
        {phase === 'intro' && (
          <button onClick={onClose} className="absolute top-3 right-3 btn-ghost p-1.5 z-10">
            <X size={16} />
          </button>
        )}

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Play size={24} className="text-amber-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-obsidian-100 mb-2">Watch an Ad to Download Free</h3>
            <p className="text-sm text-obsidian-400 leading-relaxed mb-1">
              Watch a short 90-second sponsored message to unlock your CV download at no cost.
            </p>
            <p className="text-xs text-obsidian-600 mb-6">
              Alternatively, pay once with Paystack or Flutterwave.
            </p>
            <div className="space-y-2 text-xs text-obsidian-500 text-left mb-6 px-2">
              {['Keep this window open for the full 90 seconds', 'A quick verification question at the end', 'Your CV unlocks immediately after'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />{t}
                </div>
              ))}
            </div>
            <button onClick={startAd} className="btn-primary w-full py-3 text-sm">
              <Play size={15} />Start Watching (90 seconds)
            </button>
            <p className="text-[10px] text-obsidian-700 mt-3">
              By watching, you agree to view a sponsored message. Ad revenue helps keep CVCraft free.
            </p>
          </div>
        )}

        {/* ── WATCHING ── */}
        {phase === 'watching' && (
          <div>
            {/* Ad video container — replace src with your GAM/ad-server tag or video URL */}
            <div className="relative bg-obsidian-950 aspect-video flex items-center justify-center overflow-hidden">
              {/* GAM interstitial: after AdSense approval, insert GPT tag here.
                  For now, shows a branded placeholder that counts down. */}
              <video
                autoPlay muted playsInline
                className="w-full h-full object-cover"
                src={typeof window !== 'undefined' && window.__CVCRAFT_AD_VIDEO_URL__ || ''}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              {/* Overlay with branding + timer */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian-950/70">
                <div className="text-center px-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-obsidian-500 mb-1">Sponsored</p>
                  <p className="text-lg font-display font-bold text-obsidian-200">CVCraft Partner Ad</p>
                  <p className="text-xs text-obsidian-500 mt-1">Watching helps keep CVCraft free for everyone</p>
                </div>
                {/* Countdown pill */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-obsidian-900 border border-obsidian-700">
                  <Clock size={13} className="text-amber-400" />
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>
              {/* No-skip overlay — prevent clicking through */}
              <div className="absolute inset-0 cursor-not-allowed" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-obsidian-500 mb-1.5">
                <span>Please wait…</span>
                <span>{Math.round(pct)}% complete</span>
              </div>
              <div className="h-2 bg-obsidian-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: pct < 50
                      ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                      : 'linear-gradient(90deg, #059669, #10b981)',
                  }}
                />
              </div>
              <p className="text-[10px] text-obsidian-700 mt-2 text-center">Do not close this window</p>
            </div>
          </div>
        )}

        {/* ── CAPTCHA ── */}
        {phase === 'captcha' && (
          <div className="p-6 text-center">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-obsidian-100 mb-1">Almost there!</h3>
            <p className="text-sm text-obsidian-400 mb-5">Answer this quick question to confirm you're human.</p>
            <div className={`p-4 rounded-xl border mb-4 ${captchaWrong ? 'border-red-500/40 bg-red-500/5' : 'border-obsidian-700 bg-obsidian-900/60'}`}>
              <p className="text-sm font-semibold text-obsidian-200 mb-3 font-mono">{captcha.q}</p>
              <input
                type="number"
                autoFocus
                value={captchaInput}
                onChange={e => { setCaptchaInput(e.target.value); setCaptchaWrong(false) }}
                onKeyDown={e => e.key === 'Enter' && captchaInput && submitCaptcha()}
                placeholder="Your answer"
                className="w-full px-3 py-2.5 bg-obsidian-800 border border-obsidian-600 rounded-lg text-sm text-obsidian-100 text-center focus:outline-none focus:border-amber-500/50 font-mono"
              />
              {captchaWrong && <p className="text-xs text-red-400 mt-1.5">Incorrect. Try again.</p>}
            </div>
            <button onClick={submitCaptcha} disabled={!captchaInput} className="btn-primary w-full py-3 text-sm">
              Unlock My CV
            </button>
          </div>
        )}

        {/* ── VERIFYING ── */}
        {phase === 'verifying' && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-obsidian-200">Verifying your ad view…</p>
            <p className="text-xs text-obsidian-500 mt-1">This takes just a moment</p>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === 'done' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={30} className="text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-obsidian-100 mb-1">CV Unlocked!</h3>
            <p className="text-sm text-obsidian-400">Your download is ready. Opening now…</p>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <div className="p-6 text-center">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-obsidian-100 mb-2">Verification Failed</h3>
            <p className="text-xs text-obsidian-400 mb-5 leading-relaxed">{errorMsg}</p>
            <div className="space-y-2">
              <button onClick={() => { setPhase('intro'); setElapsed(0) }} className="btn-primary w-full py-2.5 text-sm">
                Try Again
              </button>
              <button onClick={onClose} className="btn-secondary w-full py-2.5 text-sm">Close</button>
            </div>
          </div>
        )}

        {/* AdSense label at bottom — required by policy */}
        {phase === 'watching' && (
          <div className="px-4 pb-3 text-center">
            <p className="text-[9px] text-obsidian-700 uppercase tracking-widest">
              Ad · powered by CVCraft partner network
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
