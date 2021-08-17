const fs = require('fs-extra')
const express = require('express')
const router = express.Router()
const _ = require('lodash')

const config = require('../util/config')
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager(config.hub)

router.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' })
})

router.get('/meta', (req, res, next) => {
    res.status(200).send({
        branch: process.env.arm_branch,
        build_date: process.env.arm_build_date,
        commit_hash: fs.existsSync('/etc/arm_commit_hash') && fs.readFileSync('/etc/arm_commit_hash', 'utf8').trim()
    })
})

router.get('/import', (req, res, next) => {
    return res.status(200).send({ status: 'ok' })
})

router.get('/keys', async (req, res, next) => {
    try {
        let secretsList = await secretManager.listSecrets({})
        res.status(200).send({
            keys: _.map(secretsList.SecretList, 'Name')
        })
    } catch (error) {
        console.error(error)
    }
})

module.exports = router