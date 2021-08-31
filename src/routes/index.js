const fs = require('fs-extra')
const router = require('express').Router()
const _ = require('lodash')
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// local config
const config = require('../util/config')

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager(config.hub)

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

// git update webhook
router.post('/update', async (req, res, next) => {
    if (req.body.ref) {
        console.log(`git update [ ${req.body.ref} ]`)
    }

    if (config.app.mode === `production`) {
        // check if we are on the same branch as the update
        if (req.body.ref === `refs/heads/${config.git.branch}`) {
            console.log(`received git update for this branch, restarting`)
            res.status(200).send({ message: `restarting container...` })
            process.exit(0)
        }
        else {
            return res.status(200).send({ message: `Received git update but not for this branch` })
        }
    }
    else {
        return res.status(200).send({ message: `/update called on non-production instance` })
    } 
})

// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(_.map((await secretManager.listSecrets({})).SecretList, 'Name')))

module.exports = router