require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const cvRoutes = require('./routes/cv')
const coverLetterRoutes = require('./routes/coverLetter')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/cv', cvRoutes)
app.use('/api/cover-letter', coverLetterRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── DB + Start ───────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cvcraft'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.warn('⚠️  MongoDB not available — running without persistence:', err.message)
    // Still start server without DB for API-only mode
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`))
  })

// ── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

module.exports = app
