"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceBackend = void 0;
const operation_1 = require("@/server/operation");
let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
};
class CommerceBackend {
    constructor(config) {
        this.config = config;
        this.productOperation = new operation_1.Operation(this);
        this.categoryOperation = new operation_1.Operation(this);
    }
    async getCategory(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args });
    }
    async postCategory(args) {
        return await this.categoryOperation.post({ ...defaultArgs, ...args });
    }
    async getProduct(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args });
    }
    async getProducts(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args });
    }
    async postProduct(args) {
        return await this.productOperation.post({ ...defaultArgs, ...args });
    }
    async deleteProduct(args) {
        return await this.productOperation.delete({ ...defaultArgs, ...args });
    }
    async getImagesForVariant(parent) {
        return parent.images;
    }
    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`;
    }
}
exports.CommerceBackend = CommerceBackend;
module.exports = {
    CommerceBackend,
    backends: {
        bigcommerce: require('./bigcommerce'),
        commercetools: require('./commercetools'),
        hybris: require('./hybris'),
    }
};
