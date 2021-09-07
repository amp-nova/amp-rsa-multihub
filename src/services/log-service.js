const router = require('express').Router()
const logger = require('../util/logger')

router.get('/logs/:requestId?', async (req, res, next) => {
    if (!req.params.requestId) {
        res.status(200).send(logger.getAppLogs())
    }
    else {
        res.status(200).send(await logger.readRequestObject(req.params.requestId))
    }
})

module.exports = router