import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const updated = 'June 2026'

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1" />
          Back
        </button>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} className="text-amber-400" />
            <h1 className="font-display text-3xl font-bold text-obsidian-100">Privacy Policy</h1>
          </div>
          <p className="text-xs text-obsidian-500 mb-8">Last updated: {updated}</p>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. What This Policy Covers</h2>
              <p>
                CVCraft is a client-side CV and cover letter builder that runs primarily in your browser. This policy explains what data we handle, why we handle it, and the few circumstances in which information leaves your device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. Data Stored Locally</h2>
              <p>
                Your CVs, cover letters, templates, and personalization choices are saved in your browser using <strong>localStorage</strong> via Zustand with the storage key <code>cvcraft-storage</code>. This data never touches our servers unless you explicitly use a feature that requires it.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. Payments</h2>
              <p>
                When you pay to unlock a CV, we transmit the minimum information required to complete the transaction — primarily your email address and a reference ID — to the payment provider you choose (Paystack or Flutterwave). We do not store full card details. Payment records are kept server-side (MongoDB) only to verify your purchase and restore access if needed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Report Issue Form</h2>
              <p>
                The "Report Issue" page opens your default email client addressed to <strong>felisonemma@gmail.com</strong>. No data is sent to our servers through this form — the email is composed and sent entirely by your own email app.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Cookies & Analytics</h2>
              <p>
                We do not use advertising or tracking cookies. We do not currently run analytics scripts. localStorage is used solely to persist your documents between sessions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. Data Security</h2>
              <p>
                Because most of your data lives in your own browser, the biggest risk is local device access. We recommend using device-level protections (PIN, biometrics, encrypted disk) and regularly exporting backups via the Dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Third-Party Services</h2>
              <p>
                Payment processing is handled by <strong>Paystack</strong> and <strong>Flutterwave</strong>. Their respective privacy policies govern the data they collect during checkout. We are not responsible for their privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Your Choices</h2>
              <p className="space-y-2">
                <span>• <strong>Clear data:</strong> Use your browser settings to clear localStorage, or click "Delete" on individual CVs from the Dashboard.</span><br />
                <span>• <strong>Export backup:</strong> Download a JSON backup before clearing data.</span><br />
                <span>• <strong>Do not pay:</strong> Use the free editor locally without ever entering payment details.</span>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Contact</h2>
              <p>
                Questions about this policy? Email us at <strong>felisonemma@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
