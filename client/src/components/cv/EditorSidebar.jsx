import { useStore } from '../../store/index.js'
import { User, Briefcase, GraduationCap, Code, FolderOpen, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import PersonalSection from './sections/PersonalSection.jsx'
import ExperienceSection from './sections/ExperienceSection.jsx'
import EducationSection from './sections/EducationSection.jsx'
import SkillsSection from './sections/SkillsSection.jsx'
import ProjectsSection from './sections/ProjectsSection.jsx'
import CertificationsSection from './sections/CertificationsSection.jsx'

const SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User, component: PersonalSection },
  { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceSection },
  { id: 'education', label: 'Education', icon: GraduationCap, component: EducationSection },
  { id: 'skills', label: 'Skills', icon: Code, component: SkillsSection },
  { id: 'projects', label: 'Projects', icon: FolderOpen, component: ProjectsSection },
  { id: 'certifications', label: 'Certifications', icon: Award, component: CertificationsSection },
]

export default function EditorSidebar({ cv, cvId, activeSection, setActiveSection }) {
  const { toggleSectionVisibility } = useStore()

  const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component
  const activeIndex = SECTIONS.findIndex(s => s.id === activeSection)
  const previousSection = activeIndex > 0 ? SECTIONS[activeIndex - 1] : null
  const nextSection = activeIndex >= 0 && activeIndex < SECTIONS.length - 1 ? SECTIONS[activeIndex + 1] : null

  return (
    <div className="flex h-full">
      {/* ── Section nav ── */}
      <nav className="w-14 md:w-48 flex-shrink-0 border-r border-obsidian-900 bg-obsidian-950 py-3 flex flex-col gap-0.5 px-1.5 md:px-2">
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          const isVisible = cv.sections[id]?.visible !== false
          return (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`nav-item w-full justify-start ${isActive ? 'active' : ''} ${!isVisible ? 'opacity-40' : ''}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="hidden md:inline text-xs truncate">{label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto hidden md:block" />}
            </button>
          )
        })}

        <div className="flex-1" />

        {/* Visibility toggle for current section */}
        {activeSection !== 'personal' && (
          <div className="px-1 pb-2 hidden md:block">
            <button
              onClick={() => toggleSectionVisibility(cvId, activeSection)}
              className={`w-full text-[10px] px-2 py-1.5 rounded border transition-colors ${
                cv.sections[activeSection]?.visible !== false
                  ? 'text-obsidian-400 border-obsidian-700 hover:border-obsidian-600'
                  : 'text-amber-400 border-amber-500/30 bg-amber-500/5'
              }`}
            >
              {cv.sections[activeSection]?.visible !== false ? 'Hide Section' : 'Show Section'}
            </button>
          </div>
        )}
      </nav>

      {/* ── Section editor ── */}
      <div className="w-72 md:w-80 flex-shrink-0 border-r border-obsidian-900 bg-obsidian-950/50 flex flex-col min-h-0">
        <div className="p-4 overflow-y-auto flex-1">
          {ActiveComponent && <ActiveComponent cv={cv} cvId={cvId} />}
        </div>
        <div className="border-t border-obsidian-900 bg-obsidian-950/95 p-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => previousSection && setActiveSection(previousSection.id)}
            disabled={!previousSection}
            className="btn-secondary justify-center px-3 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={() => nextSection && setActiveSection(nextSection.id)}
            disabled={!nextSection}
            className="btn-primary justify-center px-3 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{nextSection ? `Next: ${nextSection.label}` : 'Done'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
