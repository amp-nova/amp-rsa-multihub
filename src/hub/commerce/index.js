const config = require('../../util/config')
const _ = require('lodash')
const chalk = require('chalk')

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager(config.hub)

let getClient = async context => {
  try {
    let secret = await secretManager.getSecretValue({ SecretId: context.backendKey })
    let cred = JSON.parse(secret.SecretString)
    if (cred) {
      let [credType, credId] = context.backendKey.split('/')
      cred = {
        ...cred,
        type: credType,
        id: credId
      }
      let backendType = require(`./backends/${cred.type}`)
      let backend = new backendType({ cred, context })
      return backend
    }
    else {
      throw new Error(`No commerce backend matches key [ ${key} ]. Please make sure you have set the 'x-commerce-backend-key' header.`)
    }
  } catch (error) {
    console.error(chalk.red(`Error retrieving secret: ${error}`))
  }
}

module.exports = async context => {
  return await getClient(context)
}