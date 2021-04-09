const _ = require('lodash')

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
    products:   async (_, args, context) => await context.datasource.client.products.get(args),
    product:    async (_, args, context) => await context.datasource.client.products.getOne(args),

    categories: async (_, args, context) => await context.datasource.client.categories.get(args),
    category:   async (_, args, context) => await context.datasource.client.categories.getOne(args),
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