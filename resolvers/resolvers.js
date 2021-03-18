var _a = require('../datasources/mock-data'), products = _a.products, categories = _a.categories;
module.exports.resolvers = {
    Query: {
        products: function () { return products; },
        productById: function (parent, args, context, info) {
            return products.find(function (x) { return x.id === args.id; });
        },
        productBySku: function (parent, args, context, info) {
            return products.find(function (x) { return x.sku === args.sku; });
        },
        productBySlug: function (parent, args, context, info) {
            return products.find(function (x) { return x.slug === args.slug; });
        },
        categories: function () { return categories; },
        categoryById: function (parent, args, context, info) {
            return categories.find(function (x) { return x.id === args.id; });
        },
        categoryBySlug: function (parent, args, context, info) {
            return categories.find(function (x) { return x.slug === args.slug; });
        }
    },
    Category: {
        children: function (parent, args, context, info) {
            var childrenList = parent.children;
            return childrenList && categories.filter(function (x) { return childrenList.includes(x.id); });
        },
        products: function (parent, args, context, info) {
            var productsList = parent.products;
            return productsList && products.filter(function (x) { return productsList.includes(x.id); });
        }
    },
    Product: {
        categories: function (parent, args, context, info) {
            var categoriesList = parent.categories;
            return categoriesList && categories.filter(function (x) { return categoriesList.includes(x.id); });
        }
    }
};
//# sourceMappingURL=resolvers.js.map