// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, Cookie, ShieldCheck, EyeOff, Settings, Info } from 'lucide-react'

// export default function CookiePolicy() {
//   const navigate = useNavigate()

//   return (
//     <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
//       <div className="max-w-3xl mx-auto">
//         <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
//           <ArrowLeft size={14} className="inline mr-1" />
//           Back
//         </button>

//         <div className="card p-8 md:p-12 mb-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
//               <Cookie size={24} className="text-amber-400" />
//             </div>
//             <div>
//               <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Cookie Policy</h1>
//               <p className="text-xs text-obsidian-500 mt-1">Last updated: June 2026</p>
//             </div>
//           </div>

//           <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. What Are Cookies</h2>
//               <p>
//                 Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to site owners.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. How CVCraft Uses Cookies</h2>
//               <p>
//                 CVCraft uses <strong>localStorage</strong> (not traditional cookies) to save your documents and preferences in your browser. This is functionally similar to a cookie but provides more storage capacity and is only accessible by our application running on your device.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. Essential Storage</h2>
//               <p>
//                 The following data is stored locally in your browser:
//               </p>
//               <ul className="list-disc list-inside text-obsidian-400 space-y-1 mt-2">
//                 <li>Your CV documents and cover letters</li>
//                 <li>Template preferences and customization choices</li>
//                 <li>Your Anthropic API key (if you choose to set one)</li>
//                 <li>Payment unlock status for individual documents</li>
//               </ul>
//               <p className="text-obsidian-400 mt-2">
//                 This data never leaves your browser unless you use a feature that explicitly requires it (e.g., payment processing or AI generation).
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Advertising Cookies</h2>
//               <p>
//                 CVCraft may serve Google AdSense advertisements on certain pages. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <strong>Google's Ads Settings</strong>.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Analytics</h2>
//               <p>
//                 We do not currently use analytics cookies or tracking scripts. If we introduce analytics in the future, we will update this policy and provide an opt-out mechanism where required by law.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. Managing Cookies and Storage</h2>
//               <p>
//                 You can clear localStorage data at any time through your browser settings. Note that clearing localStorage will remove all your saved CVs and cover letters from CVCraft. We recommend exporting a backup before clearing data (available in the Dashboard).
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Third-Party Cookies</h2>
//               <p>
//                 Third-party services we integrate with may set their own cookies:
//               </p>
//               <ul className="list-disc list-inside text-obsidian-400 space-y-1 mt-2">
//                 <li><strong>Paystack/Flutterwave:</strong> Payment processing cookies during checkout</li>
//                 <li><strong>Anthropic:</strong> API authentication when using AI features</li>
//                 <li><strong>Google AdSense:</strong> Advertising cookies on pages where ads are displayed</li>
//               </ul>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Updates to This Policy</h2>
//               <p>
//                 We may update this Cookie Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Contact</h2>
//               <p>
//                 Questions about our Cookie Policy? Contact us at <strong>felisonemma@gmail.com</strong>.
//               </p>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
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

