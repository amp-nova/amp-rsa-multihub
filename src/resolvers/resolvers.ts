const _ = require('lodash')

const commercehub = require('../hub/commerce')

let get = key => async (parent, args, context, info) => await (await commercehub.getClient(context)).get(key, args)
let getOne = key => async (parent, args, context, info) => await (await commercehub.getClient(context)).getOne(key, args)

let getCategoryHierarchy = filter => async (parent, args, context, info) => {
  let payload = await get('categories')(parent, args, context, info)
  let categories = payload.results

  let populateChildren = category => {
    category.children = _.filter(categories, c => c.parent && (c.parent.id === category.id))
    _.each(category.children, populateChildren)
    return category
  }

  return _.map(_.filter(categories, filter), populateChildren)
}

module.exports.resolvers = {
  Query: {
    products:   get('products'),
    product:    getOne('products'),

    categoryHierarchy: async (parent, args, context, info) => await getCategoryHierarchy(c => c.ancestors.length === 0)(parent, args, context, info),
    category:   async (parent, args, context, info) => _.first(await getCategoryHierarchy(c => c.id === args.id || c.slug === args.slug)(parent, args, context, info)),

    // deprecated in favor of categoryHierarchy
    categories: get('categories'),
  },
  Variant: {
    attribute: (parent, args, context, info) => {
      return _.get(_.find(parent.attributes, att => att.name === args.name), 'value')
    }
  },
  Category: {
    products: async (parent, args, context, info) => {
      let products = (await get('products')(parent, { filter: args.full ? [`categories.id: subtree("${parent.id}")`] : [`categories.id: "${parent.id}"`] }, context, info)).results
      return _.filter(products, prod => _.isEmpty(args.query) || prod.name.toLowerCase().includes(args.query))
    }
  }
};