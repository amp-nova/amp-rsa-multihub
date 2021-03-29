const { gql } = require('apollo-server');

type Product = {
  id: string,
  slug?: string,
  name: string,
  shortDescription?: string,
  longDescription?: string,
  categories?: Category[],
  variants: Variant[]
}

type Variant = {
  id: string,
  sku: string,
  prices: Prices,
  defaultImage?: Image,
  images: Image[]
}

type Image = {
  url: string
}

type Category = {
  id: string,
  name: string,
  slug: string,
  children: Category[],
  products: Product[]
}

type SearchResult = {
  products: Product[]
}

type Prices = {
  sale: number,
  list: number
}
 
module.exports.typeDefs = gql`
  type ProductResults {
    limit: Int
    offset: Int
    count: Int
    total: Int
    results: [Product]
  }

  type CategoryResults {
    limit: Int
    offset: Int
    count: Int
    total: Int
    results: [Category]
  }

  type Product {
    id: String!
    name: String!
    slug: String
    categories: [Category]
    shortDescription: String
    longDescription: String
    variants: [Variant!]
  }

  type Category {
    id: String!
    name: String!
    slug: String
    children: [Category]
    products: [Product]
  }

  type Prices {
    sale: Float
    list: Float
  }

  type Variant {
    id: String!
    sku: String!
    prices: Prices
    defaultImage: Image
    images: [Image!]
  }

  type Image {
    title: String
    alt: String
    url: String!
  }

  type SearchResult {
    products: [Product]
    currentFilters: [CurrentFilter]
    refinements: [Refinement]
    sortingOptions: [SortOption]
  }
  type SortOption {
      id: String!
      label: String!
  }
  type Refinement {
      attributeId: String!
      label: String!
      values: [RefinementValue]
  }
  type RefinementValue {
      label: String!
      value: String!
      hitCount: Int
      values: [RefinementValue]
  }
  type CurrentFilter {
      id: String
      value: String!
  }
  input Filter {
      id: String
      value: String!
  }

  type Query {
    products(limit: Int, offset: Int): ProductResults
    productById(id: String!): Product
    productBySku(sku: String!): Product
    productBySlug(slug: String!): Product
    productSearch(searchText: String!, limit: Int, offset: Int): SearchResult
    categories(limit: Int, offset: Int): CategoryResults
    categoryById(id: String!): Category
    categoryBySlug(slug: String!): Category
  }
`;