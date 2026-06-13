
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Cookie } from 'lucide-react'

export default function CookiePolicy() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1.5" />Back
        </button>
        <div className="card p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <Cookie size={26} className="text-amber-400" />
            <h1 className="font-display text-3xl font-bold text-obsidian-100">Cookie Policy</h1>
          </div>
          <p className="text-xs text-obsidian-500 mb-10">Last updated: June 13, 2026</p>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device by your browser. They are widely used to make websites work, remember your preferences, and deliver advertising. CVCraft uses a combination of browser localStorage (first-party) and third-party cookies set by Google AdSense.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">Cookies We Use</h2>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-obsidian-700">
                      <th className="text-left py-2 pr-4 text-obsidian-400 font-semibold">Name</th>
                      <th className="text-left py-2 pr-4 text-obsidian-400 font-semibold">Type</th>
                      <th className="text-left py-2 pr-4 text-obsidian-400 font-semibold">Purpose</th>
                      <th className="text-left py-2 text-obsidian-400 font-semibold">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="text-obsidian-300">
                    {[
                      ['cvcraft-storage', 'Essential (localStorage)', 'Stores your CVs, cover letters and settings locally.', 'Until cleared'],
                      ['__ar', 'Advertising (Google)', 'Google AdSense ad serving and personalisation.', 'Session / 1 year'],
                      ['DSID', 'Advertising (Google)', 'Used by Google DoubleClick for ad targeting.', '2 weeks'],
                      ['IDE', 'Advertising (Google)', 'Google DoubleClick — tracks ad conversion.', '1 year'],
                      ['NID', 'Advertising (Google)', 'Google — preferences and ad personalisation.', '6 months'],
                      ['_ga', 'Analytics (optional)', 'Google Analytics — distinguishes users. Only set if analytics is enabled.', '2 years'],
                    ].map(([name, type, purpose, expiry]) => (
                      <tr key={name} className="border-b border-obsidian-800">
                        <td className="py-2 pr-4 font-mono text-obsidian-200">{name}</td>
                        <td className="py-2 pr-4">{type}</td>
                        <td className="py-2 pr-4">{purpose}</td>
                        <td className="py-2 whitespace-nowrap">{expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Here are links for the most common browsers:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-obsidian-400">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Microsoft Edge</a></li>
              </ul>
              <p className="mt-3">To opt out of Google's personalised advertising specifically, visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">google.com/settings/ads</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">aboutads.info</a>.</p>
              <p className="mt-2">Note: disabling essential localStorage will prevent CVCraft from saving your CV between sessions.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">Contact</h2>
              <p>Questions? Email <a href="mailto:support@getcvcraft.com" className="text-amber-400 hover:underline">support@getcvcraft.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

