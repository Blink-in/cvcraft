const { connectDB } = require('./_lib/mongoose')
const CV = require('./_lib/models/CV')

module.exports = async function handler(req, res) {
  await connectDB()

  const { method } = req
  const { sessionId, id } = req.query

  switch (method) {
    case 'GET':
      try {
        const cvs = await CV.find({ sessionId }).sort({ updatedAt: -1 })
        res.status(200).json(cvs)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break

    case 'POST':
      try {
        const cv = await CV.create(req.body)
        res.status(201).json(cv)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
      break

    case 'PUT':
      try {
        const cv = await CV.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!cv) return res.status(404).json({ error: 'CV not found' })
        res.status(200).json(cv)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
      break

    case 'DELETE':
      try {
        const cv = await CV.findByIdAndDelete(id)
        if (!cv) return res.status(404).json({ error: 'CV not found' })
        res.status(200).json({ message: 'CV deleted' })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}