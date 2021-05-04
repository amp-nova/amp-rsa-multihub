const _ = require('lodash')

const commercehub = require('../hub/commerce')

let get = key => async (parent, args, context, info) => await (await commercehub.getClient(context.backendKey)).get(key, args)
let getOne = key => async (parent, args, context, info) => await (await commercehub.getClient(context.backendKey)).getOne(key, args)
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
};