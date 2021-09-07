"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
// translation
router.post('/api/translation/translate-content-item', async (req, res, next) => {
    res.status(200).send(await req.hub.translateContentItem(req.body.payload.id, req.body.payload.locale));
});
module.exports = router;
