// const { products, categories } = require ('../datasources/commercetools');
// const { products, categories } = require ('../datasources/mock-data');
const { products, categories } = require ('../datasources/bigcommerce');

module.exports.resolvers = {
  Query: {
    products: products.get,
    productById: async (parent, args, context, info) => await products.getById(args.id),
    productBySku: async (parent, args, context, info) => await products.getBySku(args.sku),
    productBySlug: async (parent, args, context, info) => await products.getBySlug(args.slug),
    productSearch: async (parent, args, context, info) => await products.search(args.searchText),

    categories: categories.get,
    categoryById: async (parent, args, context, info) => await categories.getById(args.id),
    categoryBySlug: async (parent, args, context, info) => await categories.getBySlug(args.slug),
  }
};