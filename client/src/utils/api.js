import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── CV ────────────────────────────────────────────────────────────────────
export const cvAPI = {
  getBySession: (sessionId) => api.get(`/cv/${sessionId}`),
  create: (data) => api.post('/cv', data),
  update: (id, data) => api.put(`/cv/${id}`, data),
  delete: (id) => api.delete(`/cv/${id}`),
}

// ── Cover Letter ──────────────────────────────────────────────────────────
export const coverLetterAPI = {
  getBySession: (sessionId) => api.get(`/cover-letter/${sessionId}`),
  create: (data) => api.post('/cover-letter', data),
  update: (id, data) => api.put(`/cover-letter/${id}`, data),
  delete: (id) => api.delete(`/cover-letter/${id}`),
}

export default api
