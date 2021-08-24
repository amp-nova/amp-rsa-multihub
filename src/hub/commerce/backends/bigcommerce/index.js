// 3rd party libs
const _ = require('lodash')

const CommerceBackend = require('../index')

const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('../../../../util/helpers')

class BigCommerceBackend extends CommerceBackend {
    constructor(config) {
        super(config)
        this.productOperation = productOperation(config)
        this.categoryOperation = categoryOperation(config)
    }

    // override
    async getCategory(args) {
        let hierarchy = await this.getCategoryHierarchy({})
        return findCategory(hierarchy, args)
    }

    async getCategoryHierarchy(args) {
        return (await super.getCategory({})).getResults()
    }

    async getProductsForCategory(parent) {
        // how to get products from child categories?
        return (await this.getProducts({ "categories:in": parent.id })).getResults()
    }

    async getImagesForVariant(parent) {
        let imageSetNumber = _.get(_.find(parent.attributes, att => att.name.toLowerCase() === 'articlenumbermax'), 'value').padStart(6, '0')
        return [{ url: `https://i8.amplience.net/s/willow/${imageSetNumber}` }]
    }
}

module.exports = BigCommerceBackend
