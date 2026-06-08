import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// ─── Default empty CV ─────────────────────────────────────────────────────
export const createEmptyCV = (overrides = {}) => ({
  id: uuidv4(),
  sessionId: null,
  title: 'Untitled CV',
  template: 'classic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customization: {
    primaryColor: '#1a1814',
    accentColor: '#c9a84c',
    fontFamily: 'DM Sans',
    fontSize: 'md',
    spacing: 'normal',
  },
  sections: {
    personal: {
      visible: true,
      data: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        photo: null,
        summary: '',
      }
    },
    experience: {
      visible: true,
      data: []
    },
    education: {
      visible: true,
      data: []
    },
    skills: {
      visible: true,
      data: { technical: [], soft: [], languages: [] }
    },
    projects: {
      visible: true,
      data: []
    },
    certifications: {
      visible: true,
      data: []
    },
  },
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications'],
  monetization: {
    downloadUnlocked: false,
    editUnlocked: false,
    downloadedAt: null,
    paidAt: null,
    unlockedBy: null,
    lastCheckoutAt: null,
  },
  ...overrides,
})

export const createEmptyCoverLetter = (overrides = {}) => ({
  id: uuidv4(),
  sessionId: null,
  title: 'Untitled Cover Letter',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  jobTitle: '',
  company: '',
  hiringManager: '',
  tone: 'professional',
  keySkills: '',
  content: '',
  linkedCvId: null,
  customization: {
    primaryColor: '#1a1814',
    accentColor: '#c9a84c',
    fontFamily: 'DM Sans',
  },
  ...overrides,
})

// ─── Zustand Store ─────────────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      // Session
      sessionId: uuidv4(),

      // Documents
      cvs: [],
      coverLetters: [],

      // Active editing state
      activeCvId: null,
      activeCoverLetterId: null,

      // UI state
      activeSection: 'personal',
      previewMode: false,
      sidebarOpen: true,

      // ── CV Actions ────────────────────────────────────
      createCV: (overrides = {}) => {
        const sessionId = get().sessionId
        const newCV = createEmptyCV({ ...overrides, sessionId })
        set(state => ({ cvs: [...state.cvs, newCV], activeCvId: newCV.id }))
        return newCV
      },

      duplicateCV: (id) => {
        const cv = get().cvs.find(c => c.id === id)
        if (!cv) return
        const { monetization: _ignored, ...rest } = cv
        const duplicate = {
          ...rest,
          id: uuidv4(),
          title: `${cv.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          monetization: { ...(cv.monetization || {}) },
        }
        set(state => ({ cvs: [...state.cvs, duplicate] }))
      },

      deleteCV: (id) => {
        set(state => ({
          cvs: state.cvs.filter(c => c.id !== id),
          activeCvId: state.activeCvId === id ? null : state.activeCvId,
        }))
      },

      setActiveCV: (id) => set({ activeCvId: id, activeSection: 'personal' }),

      updateCV: (id, updater) => {
        set(state => ({
          cvs: state.cvs.map(cv =>
            cv.id === id
              ? { ...updater(cv), updatedAt: new Date().toISOString() }
              : cv
          )
        }))
      },

      updateCVField: (id, path, value) => {
        set(state => ({
          cvs: state.cvs.map(cv => {
            if (cv.id !== id) return cv
            const updated = deepSet({ ...cv }, path, value)
            return { ...updated, updatedAt: new Date().toISOString() }
          })
        }))
      },

      updatePersonal: (cvId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            personal: {
              ...cv.sections.personal,
              data: { ...cv.sections.personal.data, [field]: value }
            }
          }
        }))
      },

      addExperience: (cvId) => {
        const entry = { id: uuidv4(), role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: { ...cv.sections, experience: { ...cv.sections.experience, data: [...cv.sections.experience.data, entry] } }
        }))
      },

      updateExperience: (cvId, entryId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            experience: {
              ...cv.sections.experience,
              data: cv.sections.experience.data.map(e => e.id === entryId ? { ...e, [field]: value } : e)
            }
          }
        }))
      },

      removeExperience: (cvId, entryId) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            experience: {
              ...cv.sections.experience,
              data: cv.sections.experience.data.filter(e => e.id !== entryId)
            }
          }
        }))
      },

      addEducation: (cvId) => {
        const entry = { id: uuidv4(), degree: '', school: '', field: '', startDate: '', endDate: '', grade: '', description: '' }
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: { ...cv.sections, education: { ...cv.sections.education, data: [...cv.sections.education.data, entry] } }
        }))
      },

      updateEducation: (cvId, entryId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            education: {
              ...cv.sections.education,
              data: cv.sections.education.data.map(e => e.id === entryId ? { ...e, [field]: value } : e)
            }
          }
        }))
      },

      removeEducation: (cvId, entryId) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            education: {
              ...cv.sections.education,
              data: cv.sections.education.data.filter(e => e.id !== entryId)
            }
          }
        }))
      },

      updateSkills: (cvId, category, skills) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            skills: {
              ...cv.sections.skills,
              data: { ...cv.sections.skills.data, [category]: skills }
            }
          }
        }))
      },

      addProject: (cvId) => {
        const entry = { id: uuidv4(), name: '', role: '', url: '', startDate: '', endDate: '', description: '', technologies: '' }
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: { ...cv.sections, projects: { ...cv.sections.projects, data: [...cv.sections.projects.data, entry] } }
        }))
      },

      updateProject: (cvId, entryId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            projects: {
              ...cv.sections.projects,
              data: cv.sections.projects.data.map(e => e.id === entryId ? { ...e, [field]: value } : e)
            }
          }
        }))
      },

      removeProject: (cvId, entryId) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            projects: {
              ...cv.sections.projects,
              data: cv.sections.projects.data.filter(e => e.id !== entryId)
            }
          }
        }))
      },

      addCertification: (cvId) => {
        const entry = { id: uuidv4(), name: '', issuer: '', date: '', url: '', description: '' }
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: { ...cv.sections, certifications: { ...cv.sections.certifications, data: [...cv.sections.certifications.data, entry] } }
        }))
      },

      updateCertification: (cvId, entryId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            certifications: {
              ...cv.sections.certifications,
              data: cv.sections.certifications.data.map(e => e.id === entryId ? { ...e, [field]: value } : e)
            }
          }
        }))
      },

      removeCertification: (cvId, entryId) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            certifications: {
              ...cv.sections.certifications,
              data: cv.sections.certifications.data.filter(e => e.id !== entryId)
            }
          }
        }))
      },

      updateCustomization: (cvId, field, value) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          customization: { ...cv.customization, [field]: value }
        }))
      },

      updateCVPayment: (cvId, patch) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          monetization: { ...(cv.monetization || {}), ...patch }
        }))
      },

      markCVDownloaded: (cvId) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          monetization: {
            ...(cv.monetization || {}),
            downloadUnlocked: true,
            editUnlocked: false,
            downloadedAt: new Date().toISOString(),
          }
        }))
      },

      unlockCVAccess: (cvId, source = 'rewarded_ad', unlockType = 'download') => {
        const paidSource = ['paystack', 'flutterwave', 'lemon_squeezy'].includes(source)
        get().updateCV(cvId, cv => ({
          ...cv,
          monetization: {
            ...(cv.monetization || {}),
            downloadUnlocked: unlockType === 'download' ? true : cv.monetization?.downloadUnlocked,
            editUnlocked: true,
            paidAt: paidSource ? new Date().toISOString() : cv.monetization?.paidAt,
            unlockedBy: source,
          }
        }))
      },

      toggleSectionVisibility: (cvId, section) => {
        get().updateCV(cvId, cv => ({
          ...cv,
          sections: {
            ...cv.sections,
            [section]: { ...cv.sections[section], visible: !cv.sections[section].visible }
          }
        }))
      },

      reorderSections: (cvId, newOrder) => {
        get().updateCV(cvId, cv => ({ ...cv, sectionOrder: newOrder }))
      },

      changeTemplate: (cvId, template) => {
        get().updateCV(cvId, cv => ({ ...cv, template }))
      },

      // ── Cover Letter Actions ──────────────────────────
      createCoverLetter: (overrides = {}) => {
        const sessionId = get().sessionId
        const newCL = createEmptyCoverLetter({ ...overrides, sessionId })
        set(state => ({ coverLetters: [...state.coverLetters, newCL], activeCoverLetterId: newCL.id }))
        return newCL
      },

      updateCoverLetter: (id, field, value) => {
        set(state => ({
          coverLetters: state.coverLetters.map(cl =>
            cl.id === id
              ? { ...cl, [field]: value, updatedAt: new Date().toISOString() }
              : cl
          )
        }))
      },

      deleteCoverLetter: (id) => {
        set(state => ({
          coverLetters: state.coverLetters.filter(cl => cl.id !== id),
          activeCoverLetterId: state.activeCoverLetterId === id ? null : state.activeCoverLetterId,
        }))
      },

      duplicateCoverLetter: (id) => {
        const cl = get().coverLetters.find(c => c.id === id)
        if (!cl) return
        const duplicate = { ...cl, id: uuidv4(), title: `${cl.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        set(state => ({ coverLetters: [...state.coverLetters, duplicate] }))
      },

      setActiveCoverLetter: (id) => set({ activeCoverLetterId: id }),

      // ── UI Actions ─────────────────────────────────────
      setActiveSection: (section) => set({ activeSection: section }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      // ── Import / Export ────────────────────────────────
      exportData: () => {
        const state = get()
        return JSON.stringify({ cvs: state.cvs, coverLetters: state.coverLetters, exportedAt: new Date().toISOString() }, null, 2)
      },

      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString)
          set(state => ({
            cvs: [...state.cvs, ...(data.cvs || [])],
            coverLetters: [...state.coverLetters, ...(data.coverLetters || [])],
          }))
          return true
        } catch {
          return false
        }
      },

      // ── API Key ─────────────────────────────────────────
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: 'cvcraft-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        cvs: state.cvs,
        coverLetters: state.coverLetters,
        apiKey: state.apiKey,
      }),
    }
  )
)

// ─── Helper: deep set by dot-path ─────────────────────────────────────────
function deepSet(obj, path, value) {
  const keys = path.split('.')
  const last = keys.pop()
  let curr = obj
  for (const key of keys) {
    curr[key] = { ...curr[key] }
    curr = curr[key]
  }
  curr[last] = value
  return obj
}

// ─── Selector helpers ──────────────────────────────────────────────────────
export const selectActiveCV = (state) => state.cvs.find(c => c.id === state.activeCvId)
export const selectActiveCL = (state) => state.coverLetters.find(cl => cl.id === state.activeCoverLetterId)
