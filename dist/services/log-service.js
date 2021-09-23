"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const logger_1 = __importDefault(require("@/util/logger"));
router.get('/logs/:requestId?', async (req, res, next) => {
    if (!req.params.requestId) {
        res.status(200).send(logger_1.default.getAppLogs());
    }
    else {
        res.status(200).send(await logger_1.default.readRequestObject(req.params.requestId));
    }
});
exports.default = router;
