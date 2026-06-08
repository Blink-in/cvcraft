import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Cookie, ShieldCheck, EyeOff, Settings, Info } from 'lucide-react'

export default function CookiePolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1" />
          Back
        </button>

        <div className="card p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Cookie size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Cookie Policy</h1>
              <p className="text-xs text-obsidian-500 mt-1">Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to site owners.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. How CVCraft Uses Cookies</h2>
              <p>
                CVCraft uses <strong>localStorage</strong> (not traditional cookies) to save your documents and preferences in your browser. This is functionally similar to a cookie but provides more storage capacity and is only accessible by our application running on your device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. Essential Storage</h2>
              <p>
                The following data is stored locally in your browser:
              </p>
              <ul className="list-disc list-inside text-obsidian-400 space-y-1 mt-2">
                <li>Your CV documents and cover letters</li>
                <li>Template preferences and customization choices</li>
                <li>Your Anthropic API key (if you choose to set one)</li>
                <li>Payment unlock status for individual documents</li>
              </ul>
              <p className="text-obsidian-400 mt-2">
                This data never leaves your browser unless you use a feature that explicitly requires it (e.g., payment processing or AI generation).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Advertising Cookies</h2>
              <p>
                CVCraft may serve Google AdSense advertisements on certain pages. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <strong>Google's Ads Settings</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Analytics</h2>
              <p>
                We do not currently use analytics cookies or tracking scripts. If we introduce analytics in the future, we will update this policy and provide an opt-out mechanism where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. Managing Cookies and Storage</h2>
              <p>
                You can clear localStorage data at any time through your browser settings. Note that clearing localStorage will remove all your saved CVs and cover letters from CVCraft. We recommend exporting a backup before clearing data (available in the Dashboard).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Third-Party Cookies</h2>
              <p>
                Third-party services we integrate with may set their own cookies:
              </p>
              <ul className="list-disc list-inside text-obsidian-400 space-y-1 mt-2">
                <li><strong>Paystack/Flutterwave:</strong> Payment processing cookies during checkout</li>
                <li><strong>Anthropic:</strong> API authentication when using AI features</li>
                <li><strong>Google AdSense:</strong> Advertising cookies on pages where ads are displayed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Contact</h2>
              <p>
                Questions about our Cookie Policy? Contact us at <strong>felisonemma@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
