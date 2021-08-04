const _ = require('lodash')
const Operation = require('../../operations/operation')

let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
}

class CommerceBackend {
    constructor(cred, context) {
        this.cred = cred
        this.context = context
        this.productOperation = new Operation(cred)
        this.categoryOperation = new Operation(cred)
    }

    async getCategory(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args })
    }

    async postCategory(args) {
        return await this.categoryOperation.post({ ...defaultArgs, ...args })
    }

    async getProduct(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }

    async getProducts(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }

    async postProduct(args) {
        return await this.productOperation.post({ ...defaultArgs, ...args })
    }

    async deleteProduct(args) {
        return await this.productOperation.delete({ ...defaultArgs, ...args })
    }
    
    async getImagesForVariant(parent) {
        return parent.images
    }

    getSource() {
        return `${this.cred.type}/${this.cred.id}`
    }
}

module.exports = CommerceBackend