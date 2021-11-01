import _ from 'lodash'
import { ContentItem } from "dc-management-sdk-js";
import { Product, Category } from '@amp-nova/aria-types'
import fetch from 'cross-fetch'
import URI from 'urijs'

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

    async fetch(url: string) {
        let uri = new URI(url)
        uri.addQuery(this.args)
        console.log(`[ aria ] fetch ${uri.toString()}`)
        return (await (await fetch(uri.toString(), {
            headers: {
                'x-aria-locale':    this.locale,
                'x-aria-language':  this.language,
                'x-aria-country':   this.country,
                'x-aria-currency':  this.currency,
                'x-aria-segment':   this.segment,
                'x-aria-app-url':   this.appUrl
            }
        })).json())
    }
}

export function createQueryContext(req) {
    return new QueryContext({
        args:       _.omit(req.query, 'operation'),
        locale:     req.headers['x-aria-locale'],
        language:   req.headers['x-aria-language'],
        country:    req.headers['x-aria-country'],
        currency:   req.headers['x-aria-currency'],
        segment:    req.headers['x-aria-segment'],
        appUrl:     req.headers['x-aria-app-url']
    })
}

export function fetchFromQueryContext(url: string) {
    return async (context: QueryContext) => {
        return await context.fetch(url)
    }
    // let uri = new URI(url)
    // uri.addQuery(context.args)
    // console.log(`[ aria ] fetch ${uri.toString()}`)
    // return (await (await fetch(uri.toString(), {
    //     headers: {
    //         'x-aria-locale':    context.locale,
    //         'x-aria-language':  context.language,
    //         'x-aria-country':   context.country,
    //         'x-aria-currency':  context.currency,
    //         'x-aria-segment':   context.segment,
    //         'x-aria-app-url':   context.appUrl
    //     }
    // })).json())
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