// 3rd party libs
const _ = require('lodash')

const CommerceBackend = require('../index')

const { productOperation, categoryOperation } = require('./operations')

class CommerceToolsBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.productOperation = productOperation
        this.categoryOperation = categoryOperation
    }

    async getCategoryHierarchy(parent, args) {
        let filter = 
            args.id && (c => c.id === args.id) ||
            args.slug && (c => c.slug === args.slug) ||
            (c => c.ancestors.length === 0)

        let operation = categoryOperation(args, this.cred)
        let categories = _.get(await operation.get(), 'results')

        let populateChildren = category => {
            category.children = _.filter(categories, c => c.parent && c.parent.id === category.id)
            _.each(category.children, populateChildren)
            return category
        }

        return _.map(_.filter(categories, filter), populateChildren)
    }

    async getProductsForCategory(parent, args) {
        let operation = productOperation({
            ...args,
            filter: args.full ? [`categories.id: subtree("${parent.id}")`] : [`categories.id: "${parent.id}"`]
        }, this.cred)
        return _.get(await operation.get(), 'results')
    }
}

module.exports = CommerceToolsBackend