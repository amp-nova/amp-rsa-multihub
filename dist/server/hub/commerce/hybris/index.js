"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const { CommerceBackend } = require('../index');
const { productOperation, categoryOperation } = require('./operations');
const { findCategory } = require('@/server/util/helpers');
class HybrisBackend extends CommerceBackend {
    constructor(config) {
        super(config);
        this.productOperation = productOperation(this);
        this.categoryOperation = categoryOperation(this);
    }
    async getCategory(args) {
        return findCategory(await this.getCategoryHierarchy({}), args);
    }
    async getCategoryHierarchy(args) {
        return lodash_1.default.first((await super.getCategory(args)).getResults()).children;
    }
    async getProductsForCategory(parent) {
        return lodash_1.default.map((await this.getProducts({ categoryId: parent.id })).getResults(), prod => ({
            categories: [parent],
            ...prod
        }));
    }
}
module.exports = HybrisBackend;
