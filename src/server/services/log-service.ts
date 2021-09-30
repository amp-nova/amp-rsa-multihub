const router = require('express').Router()

import { default as logger } from '@/server/util/logger'
router.get('/logs/:requestId?', async (req, res, next) => {
    if (!req.params.requestId) {
        res.status(200).send(logger.getAppLogs())
    }
    else {
        res.status(200).send(await logger.readRequestObject(req.params.requestId))
    }
})

export default router