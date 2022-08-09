// 3rd party libs
import _ from 'lodash'

const { productOperation, categoryOperation } = require('./operations')
const { findCategory } = require('../../../util/helpers')
const { CommerceBackend } = require('../index')

class BigCommerceBackend extends CommerceBackend {
    constructor(config) {
        super(config)
        this.productOperation = productOperation(this)
        this.categoryOperation = categoryOperation(this)
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
