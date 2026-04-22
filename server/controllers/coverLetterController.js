const CoverLetter = require('../models/CoverLetter')

exports.getBySession = async (req, res) => {
  try {
    const cls = await CoverLetter.find({ sessionId: req.params.sessionId }).sort({ updatedAt: -1 })
    res.json(cls)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const cl = await CoverLetter.create(req.body)
    res.status(201).json(cl)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    const cl = await CoverLetter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!cl) return res.status(404).json({ error: 'Cover letter not found' })
    res.json(cl)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const cl = await CoverLetter.findByIdAndDelete(req.params.id)
    if (!cl) return res.status(404).json({ error: 'Cover letter not found' })
    res.json({ message: 'Cover letter deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
