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
        // how to get products from child categories?
        return _.get(await this.getProducts(parent, { "categories:in": parent.id }), 'results')
    }

    async getImagesForVariant(parent) {
        let imageSetNumber = _.get(_.find(parent.attributes, att => att.name.toLowerCase() === 'articlenumbermax'), 'value').padStart(6, '0')
        return [{ url: `https://i8.amplience.net/s/willow/${imageSetNumber}` }]
    }
}

module.exports = BigCommerceBackend
