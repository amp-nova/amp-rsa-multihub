import _ from 'lodash'

const { CommerceBackend } = require('../index')
const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('@/util/helpers')

class HybrisBackend extends CommerceBackend {
    constructor(config) {
        super(config)
        this.productOperation = productOperation(this)
        this.categoryOperation = categoryOperation(this)
    }

    async getCategory(args) {
        return findCategory(await this.getCategoryHierarchy({}), args)
    }

    async getCategoryHierarchy(args) {
        return _.first((await super.getCategory(args)).getResults()).children
    }

    async getProductsForCategory(parent) {
        return _.map((await this.getProducts({ categoryId: parent.id })).getResults(), prod => ({
            categories: [parent],
            ...prod
        }))
    }
}

module.exports = HybrisBackend