import { ContentItem } from 'dc-management-sdk-js'
import { CMSClient } from "../../types"

export class Codec {
    config: any

    constructor(config) {
        this.config = config
    }

    getSource() {
        return `${this.config.type}/${this.config.key}`
    }
}

export class CMSCodec extends Codec implements CMSClient {
    constructor(config) {
        super(config)
    }

    async getContentItem(id): Promise<ContentItem> {
        return null
    }

    async translateContentItem(payload: ContentItem) {
        return null
    }
}

import { Operation } from '../operation'
import { CommerceClient } from '../../types'

let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
}

export class CommerceCodec extends Codec implements CommerceClient {
    productOperation: Operation
    categoryOperation: Operation

    constructor(config) {
        super(config)
        this.productOperation = new Operation(this)
        this.categoryOperation = new Operation(this)
    }

    // implements CommerceClient
    async getCategory(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args })
    }

    async getCategories(args) {
        return await this.categoryOperation.get({ ...defaultArgs, ...args })
    }

    async getProduct(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }

    async getProducts(args) {
        return await this.productOperation.get({ ...defaultArgs, ...args })
    }
    // end implements CommerceClient

    async getProductsForCategory(category, args) {
        throw `getProductsForCategory must be implemented`        
    }

    // future api
    async postCategory(args) {
        return await this.categoryOperation.post({ ...defaultArgs, ...args })
    }

    async postProduct(args) {
        return await this.productOperation.post({ ...defaultArgs, ...args })
    }

    async deleteProduct(args) {
        return await this.productOperation.delete({ ...defaultArgs, ...args })
    }
    // end future api
}