const mongoose = require('mongoose')

const coverLetterSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    title: { type: String, default: 'Untitled Cover Letter' },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    hiringManager: { type: String, default: '' },
    tone: { type: String, default: 'professional' },
    keySkills: { type: String, default: '' },
    content: { type: String, default: '' },
    linkedCvId: { type: String, default: null },
    customization: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CoverLetter', coverLetterSchema)
