// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, Scale, FileText, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react'

// export default function TermsOfService() {
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
//               <Scale size={24} className="text-amber-400" />
//             </div>
//             <div>
//               <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-100">Terms of Service</h1>
//               <p className="text-xs text-obsidian-500 mt-1">Last updated: June 2026</p>
//             </div>
//           </div>

//           <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">
//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">1. Acceptance of Terms</h2>
//               <p>
//                 By accessing or using CVCraft ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">2. Description of Service</h2>
//               <p>
//                 CVCraft is a client-side CV and cover letter builder that runs primarily in your web browser. The Service provides professionally designed templates, AI-assisted cover letter generation, and PDF export functionality. We do not host or store your CV data on our servers unless you explicitly use a paid feature.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">3. User Accounts and Data</h2>
//               <p>
//                 CVCraft does not require account creation. All document data is stored locally in your browser using localStorage. You are responsible for backing up your data. We are not liable for data loss resulting from browser data clearing, device changes, or local storage failures.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">4. Paid Features</h2>
//               <p>
//                 High-fidelity PDF and DOCX export require a one-time payment per document. Payments are processed by third-party providers (Paystack and Flutterwave). All sales are final. We do not offer refunds, but we will work with you to resolve any export issues.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">5. Acceptable Use</h2>
//               <p>
//                 You agree not to use the Service for any unlawful purpose, or any purpose prohibited by these terms. This includes but is not limited to: generating content that is defamatory, infringing on intellectual property rights, misleading, or violates any applicable law. You are solely responsible for the content of your CV and cover letters.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">6. AI-Generated Content</h2>
//               <p>
//                 The AI cover letter feature uses third-party AI models (Anthropic Claude). Generated content is provided as-is for your review and editing. We do not guarantee the accuracy, completeness, or suitability of AI-generated text. You are responsible for reviewing and editing all AI-generated content before use.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">7. Intellectual Property</h2>
//               <p>
//                 You retain full ownership of all content you create using CVCraft. Our templates, design system, and platform are the property of CVCraft. You may not copy, modify, or redistribute our templates or design assets outside of the Service.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">8. Limitation of Liability</h2>
//               <p>
//                 CVCraft is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service. This includes but is not limited to data loss, missed job opportunities, or errors in generated content.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">9. Third-Party Services</h2>
//               <p>
//                 The Service integrates with third-party providers including Paystack, Flutterwave (payments), and Anthropic (AI). Their respective terms of service and privacy policies apply to your use of those services. We are not responsible for the practices of third-party providers.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">10. Termination</h2>
//               <p>
//                 We reserve the right to suspend or terminate access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">11. Governing Law</h2>
//               <p>
//                 These terms shall be governed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law provisions.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-lg font-semibold text-obsidian-100 mb-2">12. Contact</h2>
//               <p>
//                 Questions about these Terms? Contact us at <strong>felisonemma@gmail.com</strong>.
//               </p>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsOfService() {
  const navigate  = useNavigate()
  const UPDATED   = 'June 13, 2026'
  const EMAIL     = 'support@getcvcraft.com'
  const SITE      = 'getcvcraft.com'

  return (
    <div className="min-h-screen bg-obsidian-950 font-body py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 btn-ghost py-1.5 px-3 text-xs">
          <ArrowLeft size={14} className="inline mr-1.5" />Back
        </button>

        <div className="card p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={26} className="text-amber-400" />
            <h1 className="font-display text-3xl font-bold text-obsidian-100">Terms of Service</h1>
          </div>
          <p className="text-xs text-obsidian-500 mb-10">Last updated: {UPDATED}</p>

          <div className="space-y-8 text-sm text-obsidian-300 leading-relaxed">

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using {SITE} ("CVCraft", "we", "us"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">2. Description of Service</h2>
              <p>CVCraft is a free online CV and cover letter builder. We provide tools to create, customise, preview, and export professional CV documents. Core features are free to use. Certain premium features (such as server-generated PDF downloads with email delivery) require a one-time payment.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">3. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-obsidian-400">
                <li>Use CVCraft only for lawful purposes</li>
                <li>Not attempt to reverse-engineer, hack, or disrupt our service</li>
                <li>Not upload or submit content that is offensive, unlawful, or infringes third-party rights</li>
                <li>Not use automated tools to scrape or abuse our platform</li>
                <li>Provide accurate information if you contact us for support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">4. Intellectual Property</h2>
              <p>You retain full ownership of the CV and cover letter content you create using CVCraft. The CVCraft application itself — including templates, code, design, and branding — is owned by CVCraft and may not be copied or redistributed without permission.</p>
              <p className="mt-2">By using our service, you grant us a limited, non-exclusive licence to process your CV content solely as required to deliver the features you request (e.g. generating a PDF for download).</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">5. Payments and Refunds</h2>
              <p>Payments for premium CV downloads are processed by Paystack or Flutterwave. Prices are shown in USD unless otherwise indicated. All sales are final once the digital file has been delivered. If you did not receive your download after a successful payment, contact us at <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline">{EMAIL}</a> within 14 days and we will resolve the issue promptly.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">6. Advertising</h2>
              <p>CVCraft displays advertisements through Google AdSense. These ads help us keep the core product free. By using CVCraft, you acknowledge that you may see advertising content. We do not endorse third-party advertisers and are not responsible for their content. You can opt out of personalised ads via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google's ad settings</a>.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">7. Disclaimer of Warranties</h2>
              <p>CVCraft is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that CVs created using our tool will result in employment. Use the service at your own discretion.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, CVCraft shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">9. Termination</h2>
              <p>We reserve the right to suspend or terminate access to CVCraft at any time if we believe you have violated these Terms. Since no account is required for the free tier, you may stop using the service at any time.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">10. Governing Law</h2>
              <p>These Terms are governed by applicable law. Any disputes will be resolved through good-faith negotiation in the first instance. For unresolved disputes, you agree to the jurisdiction of the courts applicable to CVCraft's place of business.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">11. Changes to Terms</h2>
              <p>We may update these Terms from time to time. The "last updated" date at the top will change. Continued use after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-obsidian-100 mb-2">12. Contact</h2>
              <p>Questions about these Terms? Email <a href={`mailto:${EMAIL}`} className="text-amber-400 hover:underline">{EMAIL}</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

