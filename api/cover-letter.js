const { connectDB } = require('./_lib/mongoose')
const CoverLetter = require('./_lib/models/CoverLetter')

module.exports = async function handler(req, res) {
  await connectDB()

  const { method } = req
  const { sessionId, id } = req.query

  switch (method) {
    case 'GET':
      try {
        const coverLetters = await CoverLetter.find({ sessionId }).sort({ updatedAt: -1 })
        res.status(200).json(coverLetters)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break

    case 'POST':
      try {
        const coverLetter = await CoverLetter.create(req.body)
        res.status(201).json(coverLetter)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
      break

    case 'PUT':
      try {
        const coverLetter = await CoverLetter.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!coverLetter) return res.status(404).json({ error: 'Cover Letter not found' })
        res.status(200).json(coverLetter)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
      break

    case 'DELETE':
      try {
        const coverLetter = await CoverLetter.findByIdAndDelete(id)
        if (!coverLetter) return res.status(404).json({ error: 'Cover Letter not found' })
        res.status(200).json({ message: 'Cover Letter deleted' })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}