const _ = require('lodash')

const ampvault = require('ampvault')
const config = require('../util/config')

let flattenTranslation = (text, locale = 'en') => {
  if (typeof text === 'string') {
    return text
  }
  else if (typeof text === 'object') {
    return text[locale] || _.first(Object.values(text))
  }
}

module.exports.resolvers = {
  Query: {
    products:   async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).get('products', args),
    product:    async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).getOne('products', args),
    categories: async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).get('categories', args),
    category:   async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).getOne('categories', args),
  },
  Product: {
    name: (parent, args) => flattenTranslation(parent.name, args.locale),
    slug: (parent, args) => flattenTranslation(parent.slug, args.locale),
  },
  Category: {
    name: (parent, args) => flattenTranslation(parent.name, args.locale),
    slug: (parent, args) => flattenTranslation(parent.slug, args.locale),
  }
};