"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const logger = require('../util/logger');
// translation
router.post('/api/cms/translate-content-item', async (req, res, next) => {
    logger.info(`translate-content-item webhook called [ ${req.body.payload.id} ]`);
    res.status(200).send(await req.hub.translateContentItem(req.body.payload.id, req.body.payload.locale));
});
module.exports = router;
