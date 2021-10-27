import { ContentItem } from 'dc-management-sdk-js'
import { CommerceClient, CMSClient } from "../types"
import { Operation } from '../operation'

export class Codec {
    config: CodecConfiguration

    constructor(config: CodecConfiguration) {
        this.config = config
    }
}

export class CMSCodec extends Codec implements CMSClient {
    async getContentItem(id): Promise<ContentItem> {
        return null
    }

    async translateContentItem(payload: ContentItem) {
        return null
    }
}

let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
}

export class CodecConfiguration {
    codecKey: string
    credentials: any

    getSource() {
        return this.codecKey
    }
}

export class CommerceCodec extends Codec implements CommerceClient {
    productOperation: Operation
    categoryOperation: Operation

    constructor(config) {
        super(config)
        this.productOperation = new Operation(config)
        this.categoryOperation = new Operation(config)
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