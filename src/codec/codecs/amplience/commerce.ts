import _ from 'lodash'
import { CommerceCodec, CodecConfiguration } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AmplienceCommerceProductOperation, AmplienceCommerceCategoryOperation, AmplienceFetchOperation } from './operations'

const getFetchBody = array => ({ body: { requests: _.map(_.take(array, 12), key => ({ key })) } })
const mapContent = results => _.map(results.results, 'content')

export class AmplienceCommerceCodec extends CommerceCodec {
    constructor(config) {
        super(config)
        this.productOperation = new AmplienceCommerceProductOperation(this)
        this.categoryOperation = new AmplienceCommerceCategoryOperation(this)
    }

    async populateCategory(args) {
        let operation = new AmplienceFetchOperation(this)
        let category = await new AmplienceCommerceCategoryOperation(this).get(args)

        if (category.children.length > 0) {
            category.children = mapContent(await operation.get(getFetchBody(category.children)))
        }
        await Promise.all(category.children.map(async cat => {
            if (cat.children.length > 0) {
                cat.children = mapContent(await operation.get(getFetchBody(cat.children)))
            }
        }))

        return category
    }

    async getCategoryHierarchy(args) {
        let categoryKeys = ['women', 'men', 'accessories', 'sale']
        return await Promise.all(categoryKeys.map(key => this.populateCategory({ slug: key })))
    }

    async getCategory(args) {
        return await this.populateCategory(args)
    }

    async getProductsForCategory(category, args) {
        if (category.products.length > 0) {
            return mapContent(await new AmplienceFetchOperation(this).get(getFetchBody(category.products)))
        }
        return []
    }
}

const type: CodecType = {
    key: 'amplienceCommerce',

    validate: (config: any) => {
        return config && config.credentials && config.credentials.hubName
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceCommerceCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)