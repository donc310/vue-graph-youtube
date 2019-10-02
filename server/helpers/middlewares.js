/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateQuery(req, res, next) {
    let related = parseInt(req.query.related)
    if (related === 1) {
        if (req.query.fname === undefined) {
            res.status(400).json({ message: 'fields are not good' })
        }
        next()

    } else if (related === 0) {
        if (req.query.fname === undefined) {
            res.status(400).json({ message: 'fields are not good' })
        }
        next()
    }
    else {
        res.status(400).json({ message: 'fields are not good' })
    }
}

module.exports = {
    validateQuery
}