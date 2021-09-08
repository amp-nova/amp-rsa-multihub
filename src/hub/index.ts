const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs-extra')

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

let backends = {}
let files = fs.readdirSync('src/hub')
_.each(files, file => {
  let stat = fs.statSync(`src/hub/${file}`)
  if (stat.isDirectory()) {
    backends = _.assign(backends, require(`./${file}`).backends)
  }
})

let getClient = async context => {
  try {
    let secret = await secretManager.getSecretValue({ SecretId: context.backendKey })
    let cred = JSON.parse(secret.SecretString)
    if (cred) {
      let [type, id] = context.backendKey.split('/')
      cred = {
        ...cred,
        type,
        id
      }

      let backendType = backends[type]
      let backend = new backendType({ cred, context })
      return backend
    }
    else {
      throw new Error(`No hub backend matches key [ ${context.backendKey} ]. Please make sure you have set the 'x-arm-backend-key' header.`)
    }
  } catch (error) {
    throw new Error(`Error retrieving secret: ${error}`)
  }
}

export class Backend {
}

module.exports = getClient