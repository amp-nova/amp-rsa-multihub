"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var _a = require("../mock-data/mock-data"), products = _a.products, categories = _a.categories;
var mapProduct = function (prod) {
    prod.categories = _.filter(categories, function (cat) { return _.includes(prod.categoryIds, cat.id); });
    return prod;
};
module.exports = {
    products: {
        get: function () { return _.map(products, mapProduct); },
        getById: function (id) { return mapProduct(products.find(function (x) { return x.id === id; })); },
        getBySku: function (sku) { return mapProduct(products.find(function (x) { return x.sku === sku; })); },
        getBySlug: function (slug) { return mapProduct(products.find(function (x) { return x.slug === slug; })); },
        search: function (searchText) {
            var filtered = _.filter(products, function (prod) { return prod.name.toLowerCase().includes(searchText.toLowerCase()); });
            console.log("filtered products: " + JSON.stringify(filtered));
            return { products: _.map(filtered, mapProduct) };
        },
    },
    categories: {
        get: function () { return categories; },
        getById: function (id) { return categories.find(function (x) { return x.id === id; }); },
        getBySlug: function (slug) { return categories.find(function (x) { return x.slug === slug; }); }
    }
};
//# sourceMappingURL=mock-data.js.map