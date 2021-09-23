"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const fs = require('fs-extra');
const router = require('express').Router();
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager();
// health check end point
router.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' });
});
router.get('/meta', (req, res, next) => {
    res.status(200).send({
        build_date: process.env.arm_build_date || new Date(),
        commit_hash: fs.existsSync('/etc/arm_commit_hash') && fs.readFileSync('/etc/arm_commit_hash', 'utf8').trim(),
        version: process.env.npm_package_version
    });
});
// placeholder
router.get('/import', (req, res, next) => {
    return res.status(200).send({ status: 'ok' });
});
// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(lodash_1.default.map((await secretManager.listSecrets({})).SecretList, 'Name')));
exports.default = router;
