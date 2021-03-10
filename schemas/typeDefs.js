const { gql } = require('apollo-server');

const typeDefs = gql`
  type Product {
    id: String!
    sku: String!
    slug: String!
    name: String!
    categories: [Category]
    shortDescription: String
    longDescription: String
    prices: Prices
    defaultImage: Image
    images: [Image!]
    variants: [Variant!]
  }

  type Prices {
    sale: Float
    list: Float
  }

  type Variant {
    id: String!
    prices: Prices
    defaultImage: Image
    images: [Image]
  }

  type Image {
    title: String
    alt: String
    url: String!
  }

  type Category {
    id: String!
    name: String!
    slug: String!
    children: [Category]
    products: [Product]
  }

  type Query {
    products: [Product]
    productById(id: String!): Product
    productBySku(sku: String!): Product
    productBySlug(slug: String!): Product
    categories: [Category]
    categoryById(id: String!): Category
    categoryBySlug(slug: String!): Category
  }
`;

module.exports.typeDefs = typeDefs;