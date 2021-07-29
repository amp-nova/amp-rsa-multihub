// 3rd party libs
const _ = require('lodash')

const CommerceBackend = require('../index')

const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('../../../../util/helpers')

class BigCommerceBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.productOperation = productOperation
        this.categoryOperation = categoryOperation
    }

    // override
    async getCategory(parent, args) {
        let hierarchy = await this.getCategoryHierarchy(parent, {})
        let category = findCategory(hierarchy, args)
        return category
    }

    async getCategoryHierarchy(parent, args) {
        return (await super.getCategory(parent, {})).results
    }

    async getProductsForCategory(parent) {
        // let x = await this.getProducts(parent, { "categories:in": parent.id })

        // console.log(x)

        return _.get(await this.getProducts(parent, { "categories:in": parent.id }), 'results')
    }
}

module.exports = BigCommerceBackend
