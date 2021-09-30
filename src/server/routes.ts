import _ from 'lodash'

const router = require('express').Router()
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

// health check end point
router.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' })
})

// placeholder
router.get('/import', (req, res, next) => {
    return res.status(200).send({ status: 'ok' })
})

// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(_.map((await secretManager.listSecrets({})).SecretList, 'Name')))

export default router