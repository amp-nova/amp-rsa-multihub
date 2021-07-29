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
      let backend = require(`./backends/${cred.type}`)
      return new backend(cred, context)
    }
    else {
      throw new Error(`No commerce backend matches key [ ${key} ]. Please make sure you have set the 'x-commerce-backend-key' header.`)
    }
  } catch (error) {
    console.error(chalk.red(`Error retrieving secret: ${error}`))
  }
}

// author's note: i hate this implementation and wish it were more elegant.  proxy objects maybe?
module.exports = {
  getProduct: async (parent, args, context, info) => (await getClient(context)).getProduct(parent, args, context, info),
  getProducts: async (parent, args, context, info) => (await getClient(context)).getProducts(parent, args, context, info),
  getCategory: async (parent, args, context, info) => (await getClient(context)).getCategory(parent, args, context, info),
  getCategoryHierarchy: async (parent, args, context, info) => (await getClient(context)).getCategoryHierarchy(parent, args, context, info),
  getProductsForCategory: async (parent, args, context, info) => {
    let products = await (await getClient(context)).getProductsForCategory(parent, args, context, info)
    return _.filter(products, prod => _.isEmpty(args.query) || prod.name.toLowerCase().includes(args.query))
  },
  postProduct: async (parent, args, context, info) => (await getClient(context)).postProduct(parent, args, context, info),
  deleteProduct: async (parent, args, context, info) => (await getClient(context)).deleteProduct(parent, args, context, info),
  postCategory: async (parent, args, context, info) => (await getClient(context)).postCategory(parent, args, context, info)
}