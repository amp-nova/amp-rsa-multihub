const URI = require('urijs')
const _ = require('lodash')
const axios = require('axios')
const slugify = require('slugify')

const CommerceBackend = require('../index')
const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('../../../../util/helpers')

class HybrisBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.productOperation = productOperation
        this.categoryOperation = categoryOperation

        //     productsForCategory: {
        //         uri: args => `categories/${args.id}/products`,
        //         mapper: this.mapProduct
        //     }
        // }
        this.accessToken = null
    }

    async getCategory(parent, args) {
        let categories = await this.getCategoryHierarchy(parent, {})
        return findCategory(categories, args)
    }

    async getCategoryHierarchy(parent, args) {
        let topLevelCategory = _.first(_.get(await super.getCategory(parent, args), 'results'))
        return topLevelCategory.children
    }

    async getProductsForCategory(parent, args) {
        let products = _.get(await this.getProducts(parent, { categoryId: parent.id }), 'results')
        _.each(products, prod => { prod.categories = [parent] })
        return products
    }

    async getMeta(parent, args, context, info) {
        return {
            total: parent.pagination.totalResults,
            count: parent.pagination.totalResults,
            limit: parent.pagination.pageSize,
            offset:
                (parent.pagination.currentPage - 1) *
                parent.pagination.pageSize
        }
    }
}

module.exports = HybrisBackend