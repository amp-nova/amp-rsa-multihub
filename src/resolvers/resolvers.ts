import fs from "fs";
import _ from "lodash"

// getProductBySlug(slug: string): Promise<Product>
// getCategoryBySlug(slug: string): Promise<Category>

let datasourceDirectory = `${__dirname}/../datasources`
let datasources = _.map(fs.readdirSync(datasourceDirectory), ds => ds.replace(".js", ""))
let getCommerceBackend = async context => await require(`${datasourceDirectory}/${context.commerceBackend}`)(context)

module.exports.availableCommerceBackends = datasources
module.exports.resolvers = {
  Query: {
    // products: connector.getProducts,
    products: async (_, args, context)        => await (await getCommerceBackend(context)).getProducts(),
    productById: async (_, args, context)     => await (await getCommerceBackend(context)).getProductById(args.id),
    productBySku: async (_, args, context)    => await (await getCommerceBackend(context)).getProductBySku(args.sku),
    productBySlug: async (_, args, context)   => await (await getCommerceBackend(context)).getProductBySlug(args.slug),
    productSearch: async (_, args, context)   => await (await getCommerceBackend(context)).searchProducts(args.searchText),

    categories: async (_, args, context)      => await (await getCommerceBackend(context)).getCategories(),
    categoryById: async (_, args, context)    => await (await getCommerceBackend(context)).getCategoryById(args.id),
    categoryBySlug: async (_, args, context)  => await (await getCommerceBackend(context)).getCategoryBySlug(args.slug),
  }
};