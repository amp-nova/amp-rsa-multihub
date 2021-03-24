
interface CommerceBackend {
  getProducts(): Promise<Product[]>
  getProductById(id: string): Promise<Product>
  getProductBySku(sku: string): Promise<Product>
  searchProducts(searchText: string): Promise<SearchResult>

  getCategories(): Promise<Category[]>
  getCategoryById(id: string): Promise<Category>
}

// getProductBySlug(slug: string): Promise<Product>
// getCategoryBySlug(slug: string): Promise<Category>

let mockConnector: CommerceBackend = require('../datasources/mock-data')
let bigCommerceConnector: CommerceBackend = require('../datasources/bigcommerce')
let commerceToolsConnector: CommerceBackend = require('../datasources/commercetools')

let connectors = {
  mock: mockConnector,
  bigcommerce: bigCommerceConnector,
  commercetools: commerceToolsConnector
}

module.exports.availableCommerceBackends = Object.keys(connectors)
module.exports.resolvers = {
  Query: {
    // products: connector.getProducts,
    products: async (_, args, context, info) => await connectors[context.commerceBackend].getProducts(),
    productById: async (_, args, context) => await connectors[context.commerceBackend].getProductById(args.id),
    productBySku: async (_, args, context) => await connectors[context.commerceBackend].getProductBySku(args.sku),
    productBySlug: async (_, args, context) => await connectors[context.commerceBackend].getProductBySlug(args.slug),
    productSearch: async (_, args, context) => await connectors[context.commerceBackend].searchProducts(args.searchText),

    categories: async (_, args, context) => await connectors[context.commerceBackend].getCategories(),
    categoryById: async (_, args, context) => await connectors[context.commerceBackend].getCategoryById(args.id),
    categoryBySlug: async (_, args, context) => await connectors[context.commerceBackend].getCategoryBySlug(args.slug),
  }
};