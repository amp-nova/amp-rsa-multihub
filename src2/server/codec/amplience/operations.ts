import _ from 'lodash'
import URI from 'urijs'

import { Operation } from '../../operation'

class AmplienceCommerceOperation extends Operation {
    defaultQuery: any = {}

    constructor(backend) {
        super(backend)
        this.defaultQuery = {
            depth: 'all',
            format: 'inlined'
        }
    }

    getBaseURL() {
        return `https://${this.backend.config.key}.cdn.content.amplience.net/content`
    }

    getRequest(args) {
        let uri = new URI(this.getURL(args))
        uri.addQuery(this.defaultQuery)
        return uri.toString()
    }

    async translateResponse(data, mapper = (x => x)) {
        // a AmplienceCommerce response will be either a single object, or an array in 'results'
        // if it is an array, limit, count, total, and offset are provided on the object

        return {
            // revisit this
            meta: data.responses && {
                limit: data.responses.length,
                count: data.responses.length,
                offset: 0,
                total: data.responses.length
            },
            results: await Promise.all((data.responses || [data.content]).map(await mapper))
        }
    }
}

export class AmplienceFetchOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
        this.defaultQuery = {}
    }

    getRequestPath(args) {
        return `/fetch`
    }

    async get(args) {
        return await super.post(args)
    }
}

// category operation
export class AmplienceCommerceCategoryOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
    }

    export(args) {
        return x => ({ ...x })
    }

    getRequestPath(args) {
        return args.slug && `/key/category-${args.slug}` || args.id && `/id/${args.id}`
    }
}
// end category operations

// product operation
export class AmplienceCommerceProductOperation extends AmplienceCommerceOperation {
    constructor(config) {
        super(config)
    }

    export(args) {
        return product => ({
            ...product,
            variants: _.map(product.variants, variant => ({
                ...variant,
                prices: {
                    list: variant.listPrice,
                    sale: variant.salePrice
                }
            }))
        })
    }

    async get(args) {
        if (args.productIds) {
            return { results: await Promise.all(_.map(args.productIds.split(','), p => p.replace('product-', '')).map(async slug => await this.get({ slug }))) }
        }
        else if (args.keyword) {
            // algolia?
            return []
        }
        else {
            return await super.get(args)
        }
    }

    getRequestPath(args) {
        return args.slug && `/key/product-${args.slug}`
            || args.id && `/id/${args.id}`
    }
}
