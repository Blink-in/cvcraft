import { useLayoutEffect, useRef, useState } from 'react'

// Template renderers
import ClassicTemplate from './templates/ClassicTemplate.jsx'
import ModernTemplate from './templates/ModernTemplate.jsx'
import MinimalTemplate from './templates/MinimalTemplate.jsx'
import ExecutiveTemplate from './templates/ExecutiveTemplate.jsx'
import CreativeTemplate from './templates/CreativeTemplate.jsx'
import ElegantTemplate from './templates/ElegantTemplate.jsx'
import ProfessionalTemplate from './templates/ProfessionalTemplate.jsx'
import {
  CleanFlowTemplate,
  SimpleLinearTemplate,
  TimelessSleekTemplate,
  ModernOverlayTemplate,
} from './templates/ReferenceTemplates.jsx'

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
  professional: ProfessionalTemplate,
  cleanFlow: CleanFlowTemplate,
  simpleLinear: SimpleLinearTemplate,
  timelessSleek: TimelessSleekTemplate,
  modernOverlay: ModernOverlayTemplate,
}

const A4_PAGE_HEIGHT = 1122
const PAGED_TEMPLATES = new Set(['cleanFlow', 'simpleLinear', 'timelessSleek', 'modernOverlay'])

export default function CVPreview({ cv, forExport = false }) {
  const Template = TEMPLATES[cv.template] || ClassicTemplate
  const protectedPreview = !forExport && !cv.monetization?.downloadUnlocked
  const usesPagedTemplate = PAGED_TEMPLATES.has(cv.template)
  const contentRef = useRef(null)
  const [pageCount, setPageCount] = useState(1)

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node || forExport || usesPagedTemplate) return undefined

    const updatePageCount = () => {
      setPageCount(Math.max(1, Math.ceil(node.scrollHeight / A4_PAGE_HEIGHT)))
    }

    updatePageCount()
    const observer = new ResizeObserver(updatePageCount)
    observer.observe(node)
    return () => observer.disconnect()
  }, [cv, forExport, usesPagedTemplate])

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
      className="cv-preview-pages relative shadow-2xl"
    >
      {!forExport && !usesPagedTemplate && pageCount > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
          {Array.from({ length: pageCount - 1 }, (_, index) => (
            <div
              key={index}
              className="cv-page-boundary"
              style={{ top: `${(index + 1) * A4_PAGE_HEIGHT}px` }}
            >
              <span>Page {index + 2}</span>
            </div>
          ))}
        </div>
      )}
      <div ref={contentRef} className={`cv-preview-content ${protectedPreview ? 'select-none' : ''}`}>
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
