let connector = require ('../datasources/mock-data')
if (process.env.COMMERCE_BACKEND === 'bigcommerce') {
  connector = require ('../datasources/bigcommerce')
}
else if (process.env.COMMERCE_BACKEND === 'commercetools') {
  connector = require ('../datasources/commercetools')
}

module.exports.resolvers = {
  Query: {
    products: connector.products.get,
    productById: async (_, args) => await connector.products.getById(args.id),
    productBySku: async (_, args) => await connector.products.getBySku(args.sku),
    productBySlug: async (_, args) => await connector.products.getBySlug(args.slug),
    productSearch: async (_, args) => await connector.products.search(args.searchText),

    categories: connector.categories.get,
    categoryById: async (_, args) => await connector.categories.getById(args.id),
    categoryBySlug: async (_, args) => await connector.categories.getBySlug(args.slug),
  }
};