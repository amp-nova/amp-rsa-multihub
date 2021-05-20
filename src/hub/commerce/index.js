const config = require('../../util/config')

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const secretManager = new SecretsManager(config.hub)
  
module.exports = ({
  getClient: async context => {
    try {
      let secret = await secretManager.getSecretValue({ SecretId: context.backendKey })
      let cred = JSON.parse(secret.SecretString)
      if (cred) {
        cred.type = cred.store_hash ? 'bigcommerce' : 'commercetools'
        let backend = require(`./backends/${cred.type}`)
        return new backend(cred, context)
      }
      else {
        throw new Error(`No commerce backend matches key [ ${key} ]. Please make sure you have set the 'x-commerce-backend-key' header.`)
      }
    } catch (error) {
      console.error(`Error retrieving secret: ${error}`)
    }
  }
})