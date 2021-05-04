const config = require('../../util/config')

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const secretManager = new SecretsManager(config.hub)

module.exports = ({
  getClient: async key => {
    try {
      console.log(`getClient(${key})`)
      let secret = await secretManager.getSecretValue({ SecretId: key })
      let cred = JSON.parse(secret.SecretString)
      if (cred) {
        cred.type = cred.store_hash ? 'bigcommerce' : 'commercetools'
        let backend = require(`./backends/${cred.type}`)
        return new backend(cred)
      }
      else {
        throw new Error(`No commerce backend matches key [ ${key} ]. Please make sure you have set the 'x-commerce-backend-key' header.`)
      }
    } catch (error) {
      console.error(`Error retrieving secret: ${error}`)
    }
  }
})