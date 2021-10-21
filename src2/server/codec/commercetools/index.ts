// 3rd party libs
import _ from 'lodash'
import { CommerceCodec } from '../codec'
import { CommerceToolsCategoryOperation, CommerceToolsProductOperation } from './operations'

export class CommerceToolsCodec extends CommerceCodec {
    constructor(config) {
        super(config)
        this.productOperation = new CommerceToolsProductOperation(this)
        this.categoryOperation = new CommerceToolsCategoryOperation(this)
    }

    async getCategoryHierarchy(args) {
        let filter = 
            args.id && (c => c.id === args.id) ||
            args.slug && (c => c.slug === args.slug) ||
            (c => c.ancestors.length === 0)

        let categories = (await this.categoryOperation.get({})).getResults()

        // console.log(categories)

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

export const Codec = CommerceToolsCodec
export const canAcceptCredentials = creds => {
    return false
}