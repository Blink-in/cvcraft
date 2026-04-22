const CV = require('../models/CV')

// GET /api/cv/:sessionId
exports.getBySession = async (req, res) => {
  try {
    const cvs = await CV.find({ sessionId: req.params.sessionId }).sort({ updatedAt: -1 })
    res.json(cvs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/cv
exports.create = async (req, res) => {
  try {
    const cv = await CV.create(req.body)
    res.status(201).json(cv)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// PUT /api/cv/:id
exports.update = async (req, res) => {
  try {
    const cv = await CV.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!cv) return res.status(404).json({ error: 'CV not found' })
    res.json(cv)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE /api/cv/:id
exports.remove = async (req, res) => {
  try {
    const cv = await CV.findByIdAndDelete(req.params.id)
    if (!cv) return res.status(404).json({ error: 'CV not found' })
    res.json({ message: 'CV deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
