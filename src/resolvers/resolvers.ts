import _ from "lodash"

let datasourceDirectory = `${__dirname}/../datasources`
let getCommerceBackend = context => require(`${datasourceDirectory}/${context.backendClient.type}`)(context)

module.exports.resolvers = {
  Query: {
    products:   async (_, args, context) => await getCommerceBackend(context).getProducts(args),
    product:    async (_, args, context) => await getCommerceBackend(context).getProduct(args),

    categories: async (_, args, context) => await getCommerceBackend(context).getCategories(args),
    category:   async (_, args, context) => await getCommerceBackend(context).getCategory(args),
  },
};