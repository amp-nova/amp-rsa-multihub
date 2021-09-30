// 3rd party libs
import _ from 'lodash'
const { CommerceBackend } = require('../index')
const { productOperation, categoryOperation } = require('./operations')

class CommerceToolsBackend extends CommerceBackend {
    constructor(config) {
        super(config)
        this.productOperation = productOperation(this)
        this.categoryOperation = categoryOperation(this)
    }

    async getCategoryHierarchy(args) {
        let filter = 
            args.id && (c => c.id === args.id) ||
            args.slug && (c => c.slug === args.slug) ||
            (c => c.ancestors.length === 0)

        let categories = (await this.categoryOperation.get({})).getResults()
        let populateChildren = category => {
            category.children = _.filter(categories, c => c.parent && c.parent.id === category.id)
            _.each(category.children, populateChildren)
            return category
        }

        return _.map(_.filter(categories, filter), populateChildren)
    }

    async getCategory(args) {
        return _.find(await this.getCategoryHierarchy(args), c => c.id === args.id || c.slug === args.slug)
    }

    async getProductsForCategory(parent, args) {
        return (await this.productOperation.get({
            ...args,
            filter: `categories.id: subtree("${parent.id}")`
        })).getResults()
    }
}

module.exports = CommerceToolsBackend