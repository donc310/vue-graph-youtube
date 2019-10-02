const express = require('express')
const router = express.Router()
const data = require('../models/data.model')
const m = require('../helpers/middlewares')

router.get('/', m.validateQuery, async (req, res) => {
    await data.getEntries(req.query)
        .then(posts => res.json(posts))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

module.exports = router