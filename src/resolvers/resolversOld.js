const _ = require('lodash');
const commercehub = require('../hub/commerce')

module.exports.resolvers = {
  Query: {
    product:            commercehub.getProducts,
    products:           commercehub.getProducts,
    category:           commercehub.getCategory,
    categoryHierarchy:  commercehub.getCategoryHierarchy,
    source:             (_, __, { backendKey }) => backendKey
  },
  Product: {
    raw:                x => x
  },
  Category: {
    products:           commercehub.getProductsForCategory,
    raw:                x => x
  },
  Variant: {
    attribute:          (parent, args) => _.get(_.find(parent.attributes, att => att.name.toLowerCase() === args.name.toLowerCase()), 'value'),
    defaultImage:       (parent, args) => _.first(parent.images),
    images:             commercehub.getImagesForVariant,
  },
  Mutation: {
    createProduct:      commercehub.postProduct,
    deleteProduct:      commercehub.deleteProduct,
    createCategory:     commercehub.postCategory
  }
};