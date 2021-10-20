import type { CMSCodec } from '../codec/codec'
const router = require('express').Router()

import { logger } from '../util/logger'

// translation
router.post('/api/cms/translate-content-item', async (req, res, next) => {
    logger.info(`translate-content-item webhook called [ ${req.body.payload.id} ]`)
    console.log(JSON.stringify(req.body))
    res.status(200).send(await (req.codec as CMSCodec).translateContentItem(req.body))
})

export default router