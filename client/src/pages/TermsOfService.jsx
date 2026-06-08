import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Scale, FileText, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react'

export default function TermsOfService() {
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
              <Scale size={24} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Terms of Service</h1>
              <p className="text-xs text-obsidian-500 mt-1">Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using CVCraft ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. Description of Service</h2>
              <p>
                CVCraft is a client-side CV and cover letter builder that runs primarily in your web browser. The Service provides professionally designed templates, AI-assisted cover letter generation, and PDF export functionality. We do not host or store your CV data on our servers unless you explicitly use a paid feature.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. User Accounts and Data</h2>
              <p>
                CVCraft does not require account creation. All document data is stored locally in your browser using localStorage. You are responsible for backing up your data. We are not liable for data loss resulting from browser data clearing, device changes, or local storage failures.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Paid Features</h2>
              <p>
                High-fidelity PDF and DOCX export require a one-time payment per document. Payments are processed by third-party providers (Paystack and Flutterwave). All sales are final. We do not offer refunds, but we will work with you to resolve any export issues.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Acceptable Use</h2>
              <p>
                You agree not to use the Service for any unlawful purpose, or any purpose prohibited by these terms. This includes but is not limited to: generating content that is defamatory, infringing on intellectual property rights, misleading, or violates any applicable law. You are solely responsible for the content of your CV and cover letters.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. AI-Generated Content</h2>
              <p>
                The AI cover letter feature uses third-party AI models (Anthropic Claude). Generated content is provided as-is for your review and editing. We do not guarantee the accuracy, completeness, or suitability of AI-generated text. You are responsible for reviewing and editing all AI-generated content before use.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Intellectual Property</h2>
              <p>
                You retain full ownership of all content you create using CVCraft. Our templates, design system, and platform are the property of CVCraft. You may not copy, modify, or redistribute our templates or design assets outside of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Limitation of Liability</h2>
              <p>
                CVCraft is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service. This includes but is not limited to data loss, missed job opportunities, or errors in generated content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Third-Party Services</h2>
              <p>
                The Service integrates with third-party providers including Paystack, Flutterwave (payments), and Anthropic (AI). Their respective terms of service and privacy policies apply to your use of those services. We are not responsible for the practices of third-party providers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">10. Termination</h2>
              <p>
                We reserve the right to suspend or terminate access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">11. Governing Law</h2>
              <p>
                These terms shall be governed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-obsidian-100 mb-2">12. Contact</h2>
              <p>
                Questions about these Terms? Contact us at <strong>felisonemma@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
