import _ from 'lodash'

import { CommerceCodec } from '../codec'
import { HybrisProductOperation, HybrisCategoryOperation } from './operations'
import { findCategory } from '../../util/helpers'

export class HybrisCodec extends CommerceCodec {
    constructor(config) {
        super(config)
        this.productOperation = new HybrisProductOperation(this)
        this.categoryOperation = new HybrisCategoryOperation(this)
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

export const Codec = HybrisCodec
export const canAcceptCredentials = creds => {
    return false
}
