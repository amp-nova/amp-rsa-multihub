import type { CMSBackend } from '../hub/cms'
const router = require('express').Router()

const logger = require('../util/logger')

// translation
router.post('/api/cms/translate-content-item', async (req, res, next) => {
    logger.info(`translate-content-item webhook called [ ${req.body.payload.id} ]`)

    console.log(JSON.stringify(req.body))

    res.status(200).send(await (req.hub as CMSBackend).translateContentItem(req.body))
})

export default router