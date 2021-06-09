const _ = require('lodash')
const commercehub = require('../hub/commerce')

module.exports.resolvers = {
  Query: {
    product:            commercehub.getProduct,
    products:           commercehub.getProducts,
    category:           commercehub.getCategory,
    categoryHierarchy:  commercehub.getCategoryHierarchy,
    source:             (_, __, { backendKey }) => backendKey
  },
  ProductResults: {
    meta:               commercehub.getMeta
  },
  Product: {
    raw:                x => x
  },
  Category: {
    products:           commercehub.getProductsForCategory,
    raw:                x => x
  },
  Variant: {
    attribute:          (parent, args) => _.get(_.find(parent.attributes, att => att.name === args.name), 'value')
  }
};