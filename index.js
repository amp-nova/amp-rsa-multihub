const { ApolloServer, gql } = require('apollo-server');

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

const products = [
  {
    id: "1",
    sku: 'sku001',
    slug: 'my-product-1',
    name: 'My Product #1',
    categories: [ "1", "2" ],
    shortDescription: 'Short description',
    longDescription: 'Very long description of My Product 1',
    prices: {
      sale: 10.99,
      list: 12.99
    },
    defaultImage: {
      url: '/images/myProduct1Image.jpg'
    },
    images: [
      {
        url: '/images/myProduct1Image.jpg'
      }
    ],
    variants: [
        {
        id: "1",
        name: 'My Product #1 SKU',
        prices: {
          sale: 10.99,
          list: 12.99
        },
        defaultImage: {
          url: '/images/myProduct1SkuImage.jpg'
        },
        images: [
          {
            url: '/images/myProduct1SkuImage.jpg'
          }
        ]
      }
    ]
  },
  {
    id: "2",
    sku: 'sku002',
    slug: 'my-product-2',
    name: 'My Product #2',
    cartegories: [ "2" ],
    shortDescription: 'Short description',
    longDescription: 'Very long description of My Product 2',
    categories: [ "1" ],
    prices: {
      sale: 11.99,
      list: 13.99
    },
    defaultImage: {
      url: '/images/myProduct2Image.jpg'
    },
    images: [
      {
        url: '/images/myProduct2Image.jpg'
      }
    ],
    variants: [
      {
        id: "1",
        name: 'My Product #2 SKU 1',
        prices: {
          sale: 11.99,
          list: 13.99
        },
        defaultImage: {
          url: '/images/myProduct2SkuImage.jpg'
        },
        images: [
          {
            url: '/images/myProduct2SkuImage.jpg'
          }
        ]
      },
      {
        id: "2",
        name: 'My Product #2 SKU 2',
        prices: {
          sale: 12.99,
          list: 14.99
        },
        defaultImage: {
          url: '/images/myProduct2Sku2Image.jpg'
        },
        images: [
          {
            url: '/images/myProduct2Sku2Image.jpg'
          }
        ]
      }
    ]
  }
];

const categories = [
  {
    id: "1",
    name: "Category 1",
    slug: "category-1",
    children: [ "2" ],
    products: [ "1", "2" ]
  },
  {
    id: "2",
    name: "Category 2",
    slug: "category-2",
    products: [ "1" ]
  }
];

const resolvers = {
  Query: {
    products: () => products,
    productById: (parent, args, context, info) => {
      return products.find(x => x.id === args.id);
    },
    productBySku: (parent, args, context, info) => {
      return products.find(x => x.sku === args.sku);
    },
    productBySlug: (parent, args, context, info) => {
      return products.find(x => x.slug === args.slug);
    },
    categories: () => categories,
    categoryById: (parent, args, context, info) => {
      return categories.find(x => x.id === args.id);
    },
    categoryBySlug: (parent, args, context, info) => {
      return categories.find(x => x.slug === args.slug);
    }
  },
  Category: {
    children(parent, args, context, info) {
      const childrenList = parent.children;
      return childrenList && categories.filter(x => childrenList.includes(x.id));
    },
    products(parent, args, context, info) {
      const productsList = parent.products;
      return productsList && products.filter(x => productsList.includes(x.id));
    }
  },
  Product: {
    categories(parent, args, context, info) {
      const categoriesList = parent.categories;
      return categoriesList && categories.filter(x => categoriesList.includes(x.id));
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});