const _ = require('lodash')
const Operation = require('../../operations/operation')

class CommerceBackend {
    constructor(cred, context) {
        this.cred = cred
        this.context = context
        this.productOperation = (args, cred) => new Operation(args, cred)
        this.categoryOperation = (args, cred) => new Operation(args, cred)
    }

    async getCategory(parent, args, context, info) {
        let operation = this.categoryOperation(args, this.cred)
        return await operation.get()
    }

    async postCategory(parent, args, context, info) {
        let operation = this.categoryOperation(args, this.cred)
        return await operation.post()
    }

    async getProducts(parent, args, context, info) {
        let operation = this.productOperation(args, this.cred)
        return await operation.get()
    }

    async postProduct(parent, args, context, info) {
        let operation = this.productOperation(args, this.cred)
        return await operation.post()
    }

    async deleteProduct(parent, args, context, info) {
        let operation = this.productOperation(args, this.cred)
        return await operation.delete()
    }
    
    async getImagesForVariant(parent, args) {
        return parent.images
    }

    getSource() {
        return `${this.cred.type}/${this.cred.id}`
    }
}

module.exports = CommerceBackend