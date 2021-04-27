const _ = require('lodash')

const commercehub = require('@/hub/commerce')
const config = require('@/util/config')

let get = key => async (parent, args, context, info) => await (await commercehub(config.commercehub).getClient(context.backendKey)).get(key, args)
let getOne = key => async (parent, args, context, info) => await (await commercehub(config.commercehub).getClient(context.backendKey)).getOne(key, args)
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
      return JSON.stringify(parent.value)
    }
  }
};