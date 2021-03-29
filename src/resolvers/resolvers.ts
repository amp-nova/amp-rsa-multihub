import _ from "lodash"

let datasourceDirectory = `${__dirname}/../datasources`
let getCommerceBackend = context => { console.log(JSON.stringify(context)); return require(`${datasourceDirectory}/${context.backendClient.type}`)(context) }

module.exports.resolvers = {
  Query: {
    products:       async (_, args, context) => await getCommerceBackend(context).getProducts(args),
    productById:    async (_, args, context) => await getCommerceBackend(context).getProductById(args),
    productBySku:   async (_, args, context) => await getCommerceBackend(context).getProductBySku(args),
    productBySlug:  async (_, args, context) => await getCommerceBackend(context).getProductBySlug(args),
    productSearch:  async (_, args, context) => await getCommerceBackend(context).searchProducts(args),

    categories:     async (_, args, context) => await getCommerceBackend(context).getCategories(args),
    categoryById:   async (_, args, context) => await getCommerceBackend(context).getCategoryById(args),
    categoryBySlug: async (_, args, context) => await getCommerceBackend(context).getCategoryBySlug(args),
  },
};