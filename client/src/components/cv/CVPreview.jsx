import { useRef } from 'react'

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

  return (
    <div
      id="cv-preview-root"
      style={{
        width: forExport ? '794px' : 'min(794px, 100%)',
        fontFamily: cv.customization?.fontFamily || 'DM Sans',
        fontSize: cv.customization?.fontSize === 'sm' ? '12px' : cv.customization?.fontSize === 'lg' ? '15px' : '13.5px',
      }}
      className="shadow-2xl"
    >
      <Template cv={cv} />
    </div>
  )
}
