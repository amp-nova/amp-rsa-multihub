// const { products, categories } = require ('../datasources/commercetools');
// const { products, categories } = require ('../datasources/mock-data');
const { products, categories } = require ('../datasources/bigcommerce');

module.exports.resolvers = {
  Query: {
    products: products.get,
    productById: async (_, args) => await products.getById(args.id),
    productBySku: async (_, args) => await products.getBySku(args.sku),
    productBySlug: async (_, args) => await products.getBySlug(args.slug),
    productSearch: async (_, args) => await products.search(args.searchText),

    categories: categories.get,
    categoryById: async (_, args) => await categories.getById(args.id),
    categoryBySlug: async (_, args) => await categories.getBySlug(args.slug),
  }
};