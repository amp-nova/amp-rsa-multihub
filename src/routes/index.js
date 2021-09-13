const fs = require('fs-extra')
const router = require('express').Router()
const _ = require('lodash')
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// local config
const config = require('../util/config')

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

// health check end point
router.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' })
})

router.get('/meta', (req, res, next) => {
    res.status(200).send({
        branch: config.git.branch,
        build_date: process.env.arm_build_date || new Date(),
        commit_hash: fs.existsSync('/etc/arm_commit_hash') && fs.readFileSync('/etc/arm_commit_hash', 'utf8').trim(),
        version: config.packageJson.version,
        app_mode: config.app.mode
    })
})

// placeholder
router.get('/import', (req, res, next) => {
    return res.status(200).send({ status: 'ok' })
})

// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(_.map((await secretManager.listSecrets({})).SecretList, 'Name')))

module.exports = router