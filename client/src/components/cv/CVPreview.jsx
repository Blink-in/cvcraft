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

export default function CVPreview({ cv, forExport = false }) {
  const Template = TEMPLATES[cv.template] || ClassicTemplate
  const protectedPreview = !forExport && !cv.monetization?.downloadUnlocked

  return (
    <div
      id="cv-preview-root"
      data-protected-preview={protectedPreview ? 'true' : 'false'}
      onContextMenu={protectedPreview ? event => event.preventDefault() : undefined}
      onDragStart={protectedPreview ? event => event.preventDefault() : undefined}
      style={{
        width: forExport ? '794px' : 'min(794px, 100%)',
        fontFamily: cv.customization?.fontFamily || 'DM Sans',
        fontSize: cv.customization?.fontSize === 'sm' ? '12px' : cv.customization?.fontSize === 'lg' ? '15px' : '13.5px',
      }}
      className="relative overflow-hidden shadow-2xl"
    >
      <div className={protectedPreview ? 'select-none blur-[3px] opacity-55' : ''}>
        <Template cv={cv} />
      </div>
      {protectedPreview && <ProtectedPreviewOverlay />}
    </div>
  )
}

function ProtectedPreviewOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
      <div className="mx-6 max-w-xs rounded-lg border border-obsidian-950/10 bg-white/85 px-5 py-4 text-center shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-obsidian-700">Protected preview</p>
        <p className="mt-2 text-xs leading-relaxed text-obsidian-600">
          Unlock this CV to view, download, print, or capture a clean copy.
        </p>
      </div>
    </div>
  )
}
