import _ from 'lodash'
import { ContentItem } from 'dc-management-sdk-js'
import { CommerceClient, CMSClient } from "../types"
import { Operation } from '../operation'
import { ConfigClient, CredentialsClient } from '..'

export abstract class Codec {
    config: CodecConfiguration

    constructor(config: CodecConfiguration) {
        this.config = config
    }
}

export abstract class ConfigCodec extends Codec implements ConfigClient {
    abstract getConfig(): Promise<any>
}

export abstract class CredentialsCodec extends Codec implements CredentialsClient {
    abstract getCredentials(key: string): Promise<any>
}

export abstract class CMSCodec extends Codec implements CMSClient {
    abstract getContentItem(id): Promise<ContentItem>
    abstract translateContentItem(payload: ContentItem)
}

let defaultArgs = {
    currency: 'USD',
    locale: 'en-US',
    language: 'en',
    country: 'US'
}

/**
 * CodecConfiguration is a representation of a configuration for one instance of a codec. It contains a codecKey
 * (in the format <code>vendor/key</code>) and a set of credentials
 *
 * @public
 */
 export class CodecConfiguration {
    codecKey: string
    credentials: any

    get vendor() {
        return _.first(this.codecKey.split('/'))
    }

    get key() {
        return _.last(this.codecKey.split('/'))
    }
}

/**
 * CommerceCodec is the base class for codecs implementing the CommerceClient interface.
 *
 * @public
 */
 export abstract class CommerceCodec extends Codec implements CommerceClient {
    productOperation: Operation
    categoryOperation: Operation

    // constructor(config) {
    //     super(config)
    //     this.productOperation = new Operation(config)
    //     this.categoryOperation = new Operation(config)
    // }

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