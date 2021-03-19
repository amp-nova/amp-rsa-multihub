var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var gql = require('apollo-server').gql;
module.exports.typeDefs = gql(__makeTemplateObject(["\n  type Product {\n    id: String!\n    slug: String!\n    sku: String\n    name: String!\n    categories: [Category]\n    shortDescription: String\n    longDescription: String\n    variants: [Variant!]\n  }\n\n  type Prices {\n    sale: Float\n    list: Float\n  }\n\n  type Variant {\n    id: String!\n    sku: String!\n    prices: Prices\n    defaultImage: Image\n    images: [Image!]\n  }\n\n  type Image {\n    title: String\n    alt: String\n    url: String!\n  }\n\n  type Category {\n    id: String!\n    name: String!\n    slug: String!\n    children: [Category]\n    products: [Product]\n  }\n\n  type Query {\n    products: [Product]\n    productById(id: String!): Product\n    productBySku(sku: String!): Product\n    productBySlug(slug: String!): Product\n    categories: [Category]\n    categoryById(id: String!): Category\n    categoryBySlug(slug: String!): Category\n  }\n"], ["\n  type Product {\n    id: String!\n    slug: String!\n    sku: String\n    name: String!\n    categories: [Category]\n    shortDescription: String\n    longDescription: String\n    variants: [Variant!]\n  }\n\n  type Prices {\n    sale: Float\n    list: Float\n  }\n\n  type Variant {\n    id: String!\n    sku: String!\n    prices: Prices\n    defaultImage: Image\n    images: [Image!]\n  }\n\n  type Image {\n    title: String\n    alt: String\n    url: String!\n  }\n\n  type Category {\n    id: String!\n    name: String!\n    slug: String!\n    children: [Category]\n    products: [Product]\n  }\n\n  type Query {\n    products: [Product]\n    productById(id: String!): Product\n    productBySku(sku: String!): Product\n    productBySlug(slug: String!): Product\n    categories: [Category]\n    categoryById(id: String!): Category\n    categoryBySlug(slug: String!): Category\n  }\n"]));
//# sourceMappingURL=typeDefs.js.map