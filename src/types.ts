import { ContentItem } from "dc-management-sdk-js";
import { Product, Category } from '@amp-nova/aria-types'

export type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
}

export class CommonArgs {
}

export class ListArgs extends CommonArgs {
    limit?: number
    offset?: number
}

// export class Context {
//     backendKey?: string
//     codec: Codec
// }

export class GetCategoryArgs extends CommonArgs {
    id?: string
    slug?: string
}

export class GetCategoryProductArgs extends CommonArgs {
    full?: boolean
    segment?: string
}

export class GetProductsArgs extends ListArgs {
    keyword?: string
    segment?: string
    productIds?: string
}

export class GetProductArgs extends CommonArgs {
    id?: string
    sku?: string
    slug?: string
    segment?: string
}

export class GetAttributeArgs {
    name: string
}

export class QueryContext {
    args:       any
    locale:     string
    language:   string
    country:    string
    currency:   string
    segment:    string
    appUrl:     string
    method:     string = 'get'

    constructor(obj?: any) {
        this.args =     obj?.args || {}
        this.locale =   obj?.locale || 'en-US'
        this.language = obj?.language || 'en'
        this.country =  obj?.country || 'US'
        this.currency = obj?.currency || 'USD'
        this.segment =  obj?.segment || ''
        this.appUrl =   obj?.appUrl || ''
    }
}

export interface CommerceClient {
    getProducts(context: QueryContext): Promise<Product[]>
    getProduct(context: QueryContext): Promise<Product>
    getCategories(context: QueryContext): Promise<Category[]>
    getCategory(context: QueryContext): Promise<Category>
}

export interface CMSClient {
    getContentItem(id): Promise<ContentItem>
    translateContentItem(payload: ContentItem)
}

export default { QueryContext }