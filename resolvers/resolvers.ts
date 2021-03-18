const { products, categories } = require ('../datasources/mock-data');

module.exports.resolvers = {
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