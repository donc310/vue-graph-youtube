const express = require('express')
const router = express.Router()

router.use('/api/v1/graphdata', require('./data.routes'))

module.exports = router