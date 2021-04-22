const _ = require('lodash')

const ampvault = require('ampvault')
const config = require('../util/config')

let flattenTranslation = (text, language = 'en') => {
  if (typeof text === 'string') {
    return text
  }
  else if (typeof text === 'object') {
    return text[language] || _.first(Object.values(text))
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
  Variant: {
    attribute: (parent, args, context, info) => {
      return _.get(_.find(parent.attributes, att => att.name === args.name), 'value')
    }
  },
  Attribute: {
    value: (parent, args, context, info) => {
      if (typeof parent.value === 'string') {
        return parent.value
      }
      console.log(`attribute ${JSON.stringify(parent.value)}`)
      return ''
    }
  }
  // Product: {
  //   name: (parent, args) => flattenTranslation(parent.name, args.language),
  //   slug: (parent, args) => flattenTranslation(parent.slug, args.language),
  // },
  // Category: {
  //   name: (parent, args) => flattenTranslation(parent.name, args.language),
  //   slug: (parent, args) => flattenTranslation(parent.slug, args.language),
  // }
};