const mongoose = require('mongoose')

const cvSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    clientId: { type: String, required: true }, // UUID from browser
    title: { type: String, default: 'Untitled CV' },
    template: { type: String, default: 'classic' },
    customization: { type: mongoose.Schema.Types.Mixed, default: {} },
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    sectionOrder: { type: [String], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CV', cvSchema)
