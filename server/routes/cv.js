const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/cvController')

router.get('/:sessionId', ctrl.getBySession)
router.post('/', ctrl.create)
router.put('/:id', ctrl.update)
router.delete('/:id', ctrl.remove)

module.exports = router
