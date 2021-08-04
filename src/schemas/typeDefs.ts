const { gql } = require('apollo-server')
import "../types"

type ProductType = {
  id: string,
  slug?: string,
  name: string,
  shortDescription?: string,
  longDescription?: string,
  categories?: CategoryType[],
  variants: VariantType[],
  attributes: AttributeType[],
  raw: string
}

type AttributeType = {
  name: string,
  value: string
}

type VariantType = {
  id: string,
  sku: string,
  prices: Prices,
  defaultImage?: ImageType,
  images: ImageType[]
}

type ImageType = {
  url: string
}

type CategoryType = {
  id: string,
  name: string,
  slug: string,
  children: CategoryType[],
  products: ProductType[],
  raw: string
}

type SearchResultType = {
  products: ProductType[]
}

type Prices = {
  sale: number,
  list: number
}
 
module.exports.typeDefs = gql`
  scalar Raw

  type ProductResults {
    meta: ResultsMeta
    results: [Product]
  }

  type CategoryResults {
    meta: ResultsMeta
    results: [Category]
  }

  type ResultsMeta {
    limit: Int
    offset: Int
    count: Int
    total: Int
  }

  input ProductInput {
    name: String!
    slug: String
    sku: String
    shortDescription: String
    longDescription: String
    variants: [VariantInput!]
    images: [ImageInput]
    categories: [String]
  }

  input VariantInput {
    sku: String!
    prices: PriceInput
    defaultImage: ImageInput
    images: [ImageInput]
    attributes: [AttributeInput]
  }

  type Product {
    id: String!
    name: String!
    slug: String
    categories: [Category]
    shortDescription: String
    longDescription: String
    variants: [Variant!]
    raw: Raw!
    source: String!
  }

  input CategoryInput {
    id: String
    name: String!
    slug: String
    parentId: String
  }

  type Category {
    id: String!
    name: String!
    slug: String
    children: [Category]
    products(full: Boolean, query: String): [Product]
    raw: Raw!
    source: String!
  }

  input PriceInput {
    sale: String
    list: String
  }

  type Prices {
    sale: String
    list: String
  }

  input AttributeInput {
    name: String!
    value: String
  }

  type Attribute {
    name: String!
    value: String
  }

  type Variant {
    id: String!
    sku: String!
    prices: Prices
    defaultImage: Image
    images: [Image!]
    attributes: [Attribute]
    attribute(name: String): String
  }

  input ImageInput {
    title: String
    alt: String
    url: String!
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
    products(keyword: String, limit: Int, offset: Int, locale: String, currency: String): ProductResults
    product(id: String, sku: String, slug: String, locale: String, currency: String): Product
    categoryHierarchy(locale: String, currency: String): [Category]
    category(id: String, slug: String, locale: String, currency: String): Category
    categories(limit: Int, offset: Int, locale: String, currency: String): CategoryResults
    source: String
  }

  type Mutation {
    createProduct(product: ProductInput): Product
    deleteProduct(id: String): String
    createCategory(category: CategoryInput): Category
  }
`;