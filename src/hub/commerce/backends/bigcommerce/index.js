// 3rd party libs
const _ = require('lodash')

const CommerceBackend = require('../index')

const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('../../../../util/helpers')

class BigCommerceBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.productOperation = productOperation(cred)
        this.categoryOperation = categoryOperation(cred)
    }

    // override
    async getCategory(args) {
        let hierarchy = await this.getCategoryHierarchy({})
        return findCategory(hierarchy, args)
    }

    async getCategoryHierarchy(args) {
        return (await super.getCategory({})).results
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
