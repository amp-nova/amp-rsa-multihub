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

let get = key => async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).get(key, args)
let getOne = key => async (parent, args, context, info) => await (await ampvault(config.ampvault).getClient(context.backendKey)).getOne(key, args)
module.exports.resolvers = {
  Query: {
    products:   get('products'),
    product:    getOne('products'),
    categories: get('categories'),
    category:   getOne('categories'),
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