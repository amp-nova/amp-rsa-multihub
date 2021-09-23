"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party libs
const lodash_1 = __importDefault(require("lodash"));
const { productOperation, categoryOperation } = require('./operations');
const { findCategory } = require('@/server/util/helpers');
const { CommerceBackend } = require('../index');
class BigCommerceBackend extends CommerceBackend {
    constructor(config) {
        super(config);
        this.productOperation = productOperation(this);
        this.categoryOperation = categoryOperation(this);
    }
    // override
    async getCategory(args) {
        let hierarchy = await this.getCategoryHierarchy({});
        return findCategory(hierarchy, args);
    }
    async getCategoryHierarchy(args) {
        return (await super.getCategory({})).getResults();
    }
    async getProductsForCategory(parent) {
        // how to get products from child categories?
        return (await this.getProducts({ "categories:in": parent.id })).getResults();
    }
    async getImagesForVariant(parent) {
        let imageSetNumber = lodash_1.default.get(lodash_1.default.find(parent.attributes, att => att.name.toLowerCase() === 'articlenumbermax'), 'value').padStart(6, '0');
        return [{ url: `https://i8.amplience.net/s/willow/${imageSetNumber}` }];
    }
}
module.exports = BigCommerceBackend;
