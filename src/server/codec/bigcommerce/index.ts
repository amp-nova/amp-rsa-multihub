// 3rd party libs
import _ from 'lodash'

import { BigCommerceProductOperation, BigCommerceCategoryOperation } from './operations'
import { findCategory } from '../../util/helpers'
import { CommerceCodec } from '../codec'

export class BigCommerceCodec extends CommerceCodec {
    constructor(config) {
        super(config)
        this.productOperation = new BigCommerceProductOperation(this)
        this.categoryOperation = new BigCommerceCategoryOperation(this)
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

    // need to fix this
    async getImagesForVariant(parent) {
        let imageSetNumber = _.get(_.find(parent.attributes, att => att.name.toLowerCase() === 'articlenumbermax'), 'value').padStart(6, '0')
        return [{ url: `https://i8.amplience.net/s/willow/${imageSetNumber}` }]
    }
}

export const Codec = BigCommerceCodec
export const canAcceptCredentials = creds => {
    return false
}
