// Template renderers
import ClassicTemplate from './templates/ClassicTemplate.jsx'
import ModernTemplate from './templates/ModernTemplate.jsx'
import MinimalTemplate from './templates/MinimalTemplate.jsx'
import ExecutiveTemplate from './templates/ExecutiveTemplate.jsx'
import CreativeTemplate from './templates/CreativeTemplate.jsx'
import ElegantTemplate from './templates/ElegantTemplate.jsx'
import ProfessionalTemplate from './templates/ProfessionalTemplate.jsx'

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
  professional: ProfessionalTemplate,
}

export default function CVPreview({ cv, forExport = false, watermarked }) {
  const Template = TEMPLATES[cv.template] || ClassicTemplate
  const showWatermark = watermarked ?? (!forExport && !cv.monetization?.downloadUnlocked)

  return (
    <div
      id="cv-preview-root"
      style={{
        width: forExport ? '794px' : 'min(794px, 100%)',
        fontFamily: cv.customization?.fontFamily || 'DM Sans',
        fontSize: cv.customization?.fontSize === 'sm' ? '12px' : cv.customization?.fontSize === 'lg' ? '15px' : '13.5px',
      }}
      className="relative shadow-2xl overflow-hidden"
    >
      <Template cv={cv} />
      {showWatermark && <WatermarkOverlay />}
    </div>
  )
}

function WatermarkOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute -inset-24 grid grid-cols-4 gap-10 rotate-[-28deg] opacity-90">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="whitespace-nowrap text-[22px] font-bold uppercase tracking-[0.22em] text-obsidian-950/12"
          >
            CVCraft
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
        <span className="inline-flex rounded-lg border border-obsidian-950/15 bg-white/60 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-obsidian-950/45 backdrop-blur-sm">
          Preview only
        </span>
      </div>
    </div>
  )
}
