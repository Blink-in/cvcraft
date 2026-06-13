// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, ShieldCheck, Lock, EyeOff, Mail } from 'lucide-react'

// export default function PrivacyPolicy() {
//   const navigate = useNavigate()
//   const updated = 'June 2026'

//   return (
//     <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
//       <div className="max-w-3xl mx-auto">
//         <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
//           <ArrowLeft size={14} className="inline mr-1" />
//           Back
//         </button>

//         <div className="card p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <ShieldCheck size={24} className="text-amber-400" />
//             <h1 className="font-display text-3xl font-bold text-obsidian-100">Privacy Policy</h1>
//           </div>
//           <p className="text-xs text-obsidian-500 mb-8">Last updated: {updated}</p>

//           <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. What This Policy Covers</h2>
//               <p>
//                 CVCraft is a client-side CV and cover letter builder that runs primarily in your browser. This policy explains what data we handle, why we handle it, and the few circumstances in which information leaves your device.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. Data Stored Locally</h2>
//               <p>
//                 Your CVs, cover letters, templates, and personalization choices are saved in your browser using <strong>localStorage</strong> via Zustand with the storage key <code>cvcraft-storage</code>. This data never touches our servers unless you explicitly use a feature that requires it.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. Payments</h2>
//               <p>
//                 When you pay to unlock a CV, we transmit the minimum information required to complete the transaction — primarily your email address and a reference ID — to the payment provider you choose (Paystack or Flutterwave). We do not store full card details. Payment records are kept server-side (MongoDB) only to verify your purchase and restore access if needed.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Report Issue Form</h2>
//               <p>
//                 The "Report Issue" page opens your default email client addressed to <strong>felisonemma@gmail.com</strong>. No data is sent to our servers through this form — the email is composed and sent entirely by your own email app.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Cookies & Analytics</h2>
//               <p>
//                 We do not use advertising or tracking cookies. We do not currently run analytics scripts. localStorage is used solely to persist your documents between sessions.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. Data Security</h2>
//               <p>
//                 Because most of your data lives in your own browser, the biggest risk is local device access. We recommend using device-level protections (PIN, biometrics, encrypted disk) and regularly exporting backups via the Dashboard.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Third-Party Services</h2>
//               <p>
//                 Payment processing is handled by <strong>Paystack</strong> and <strong>Flutterwave</strong>. Their respective privacy policies govern the data they collect during checkout. We are not responsible for their privacy practices.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Your Choices</h2>
//               <p className="space-y-2">
//                 <span>• <strong>Clear data:</strong> Use your browser settings to clear localStorage, or click "Delete" on individual CVs from the Dashboard.</span><br />
//                 <span>• <strong>Export backup:</strong> Download a JSON backup before clearing data.</span><br />
//                 <span>• <strong>Do not pay:</strong> Use the free editor locally without ever entering payment details.</span>
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Contact</h2>
//               <p>
//                 Questions about this policy? Email us at <strong>felisonemma@gmail.com</strong>.
//               </p>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const UPDATED = 'June 13, 2026'
  const EMAIL   = 'support@getcvcraft.com'

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1.5" />Back
        </button>

        <div className="card p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={26} className="text-amber-400" />
            <h1 className="font-display text-3xl font-bold text-obsidian-100">Privacy Policy</h1>
          </div>
          <p className="text-xs text-obsidian-500 mb-10">Last updated: {UPDATED}</p>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">1. Overview</h2>
              <p>
                CVCraft ("we", "us", "our") is a free online CV and cover letter builder operated at <strong>getcvcraft.com</strong>. This Privacy Policy explains what data we collect, why we collect it, how it is used, and your rights. By using CVCraft you agree to this policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">2. Data We Collect</h2>
              <h3 className="text-sm font-semibold text-obsidian-200 mb-1 mt-3">a) Data stored locally in your browser</h3>
              <p>
                Your CV content, cover letter text, template choices, and customisation settings are stored in your browser's <code className="bg-obsidian-800 px-1.5 py-0.5 rounded text-xs">localStorage</code> using the key <code className="bg-obsidian-800 px-1.5 py-0.5 rounded text-xs">cvcraft-storage</code>. This data does not leave your device unless you use a feature that explicitly requires a server (such as PDF generation or payment processing).
              </p>
              <h3 className="text-sm font-semibold text-obsidian-200 mb-1 mt-3">b) Data sent to our servers</h3>
              <p>When you use paid features, we collect:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-obsidian-400">
                <li>A hashed session ID (anonymous device identifier)</li>
                <li>Your email address (only if you provide it for a receipt)</li>
                <li>Payment reference data from our payment processors</li>
                <li>A hashed IP address (used for fraud prevention — we never store raw IP addresses)</li>
              </ul>
              <h3 className="text-sm font-semibold text-obsidian-200 mb-1 mt-3">c) Automatically collected data</h3>
              <p>
                When you visit CVCraft, our hosting provider (Vercel) and analytics tools may automatically log standard web server data including anonymised IP addresses, browser type, referring URLs, and page views. This is used solely for site performance monitoring.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">3. Google AdSense & Advertising</h2>
              <p>
                CVCraft uses <strong>Google AdSense</strong> to display advertisements. Google AdSense is an advertising service provided by Google LLC. Google may use cookies and similar tracking technologies to serve ads based on your prior visits to our site and other sites on the internet.
              </p>
              <p className="mt-2">
                Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to CVCraft and/or other sites on the internet. You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalised advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">aboutads.info</a>.
              </p>
              <p className="mt-2">
                CVCraft does not control the cookies or tracking used by Google AdSense. Google's Privacy Policy governs how Google handles data collected through these ads: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">policies.google.com/privacy</a>.
              </p>
              <p className="mt-2">
                We use AdSense auto ads, which may place ads in various positions on our pages. We do not use personalised or interest-based ads that we control directly. Ad placements are clearly marked "Advertisement" or "Sponsored".
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">4. Cookies</h2>
              <p>CVCraft uses the following cookies:</p>
              <div className="mt-3 space-y-3">
                {[
                  { name: 'cvcraft-storage', type: 'Essential', purpose: 'Stores your CV and cover letter data locally in your browser. Without this cookie the application cannot function.' },
                  { name: 'Google AdSense cookies', type: 'Advertising', purpose: 'Used by Google to display personalised advertisements. These are set by google.com and googlesyndication.com.' },
                  { name: 'Vercel / hosting cookies', type: 'Performance', purpose: 'Set by our infrastructure provider for load balancing and security.' },
                ].map(c => (
                  <div key={c.name} className="p-3 bg-obsidian-900/50 rounded-lg border border-obsidian-800">
                    <p className="text-xs font-semibold text-obsidian-200">{c.name} <span className="font-normal text-obsidian-500 ml-1">— {c.type}</span></p>
                    <p className="text-xs text-obsidian-400 mt-0.5">{c.purpose}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3">You can manage or disable cookies through your browser settings. Note that disabling essential cookies will prevent CVCraft from saving your work.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">5. Payment Processing</h2>
              <p>
                When you pay to unlock a CV download, you are redirected to <strong>Paystack</strong> or <strong>Flutterwave</strong>. We do not receive or store your card number, bank account details, or full payment information. We receive only a transaction reference and confirmation of payment status. Their respective privacy policies apply during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">6. How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-1 text-obsidian-400">
                <li>To save and restore your CV and cover letter documents (localStorage only)</li>
                <li>To verify and restore paid download entitlements</li>
                <li>To send payment receipts to an email address you provide</li>
                <li>To display relevant advertisements via Google AdSense</li>
                <li>To detect and prevent fraud and abuse (hashed IP, session ID)</li>
                <li>To improve site performance (anonymised analytics)</li>
              </ul>
              <p className="mt-2">We do not sell, rent, or share your personal data with third parties for their own marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">7. Data Retention</h2>
              <p>
                Local browser data persists until you clear your browser storage or delete individual CVs from your dashboard. Server-side payment records are retained for 12 months for accounting and dispute resolution purposes, then deleted. Hashed IP addresses used for fraud prevention are retained for 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-obsidian-400">
                <li><strong className="text-obsidian-300">Access</strong> — request a copy of personal data we hold about you</li>
                <li><strong className="text-obsidian-300">Deletion</strong> — request deletion of your personal data from our servers</li>
                <li><strong className="text-obsidian-300">Opt out of ads</strong> — use Google's opt-out tools linked above</li>
                <li><strong className="text-obsidian-300">Clear local data</strong> — clear localStorage via your browser settings at any time</li>
              </ul>
              <p className="mt-2">To exercise any right, contact us at <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline">{EMAIL}</a>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">9. Children's Privacy</h2>
              <p>
                CVCraft is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Material changes will be noted at the top of this page with a revised "last updated" date. Continued use of CVCraft after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">11. Contact Us</h2>
              <p>Questions about this Privacy Policy?</p>
              <p className="mt-1">Email: <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline">{EMAIL}</a></p>
              <p className="mt-1">Website: <a href="https://www.getcvcraft.com" className="text-amber-400 hover:underline">www.getcvcraft.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
