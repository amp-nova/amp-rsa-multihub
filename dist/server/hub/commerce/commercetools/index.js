"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party libs
const lodash_1 = __importDefault(require("lodash"));
const { CommerceBackend } = require('../index');
const { productOperation, categoryOperation } = require('./operations');
class CommerceToolsBackend extends CommerceBackend {
    constructor(config) {
        super(config);
        this.productOperation = productOperation(this);
        this.categoryOperation = categoryOperation(this);
    }
    async getCategoryHierarchy(args) {
        let filter = args.id && (c => c.id === args.id) ||
            args.slug && (c => c.slug === args.slug) ||
            (c => c.ancestors.length === 0);
        let categories = (await this.categoryOperation.get(args)).getResults();
        let populateChildren = category => {
            category.children = lodash_1.default.filter(categories, c => c.parent && c.parent.id === category.id);
            lodash_1.default.each(category.children, populateChildren);
            return category;
        };
        return lodash_1.default.map(lodash_1.default.filter(categories, filter), populateChildren);
    }
    async getProductsForCategory(parent, args) {
        return (await this.productOperation.get({
            ...args,
            filter: `categories.id: subtree("${parent.id}")`
        })).getResults();
    }
}
module.exports = CommerceToolsBackend;
