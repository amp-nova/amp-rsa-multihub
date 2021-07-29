const URI = require('urijs')
const _ = require('lodash')
const uuid = require('uuid')

const Operation = require('../../../operations/operation')
const { formatMoneyString } = require('../../../../util/locale-formatter')
const { findCategory } = require('../../../../util/helpers')

const mapImage = image => ({ url: image.url_standard })
const slugify = require('slugify')
const { response } = require('express')
require('../../../../util/helpers')

class HybrisOperation extends Operation {
    constructor(args, cred) {
        super(args, cred)
        this.accessToken = null
    }

    async getHeaders() {
    }

    getOauthURL() {
        return `${this.cred.server}/authorizationserver/oauth/token?
            client_id=${this.cred.clientId}&
            client_secret=${this.cred.clientSecret}&
            grant_type=password&
            username=${this.cred.username}&
            password=${this.cred.password}`
    }

    getBaseURL() {
        return `${this.cred.server}/occ/v2/${this.cred.baseSiteId}`
    }

    async authenticate() {
        if (!this.accessToken) {
            let response = await axios.post(
                this.getOauthURL(), {},
            )
            // console.log(`[ sap ] access token: ${JSON.stringify(response.data)}`)
            this.accessToken = `${response.data.token_type} ${response.data.access_token}`
        }
        return this.accessToken
    }

    getRequestURL() {
        let uri = new URI(`${this.getBaseURL()}/${this.uri}`)
        return uri
    }

    // async translateResponse(data, mapper = (x => x)) {
    //     // a commercetools response will be either a single object, or an array in 'results'
    //     // if it is an array, limit, count, total, and offset are provided on the object

    //     return {
    //         meta: data.limit && {
    //             limit: data.limit,
    //             count: data.count,
    //             offset: data.offset,
    //             total: data.total
    //         },
    //         results: await Promise.all((data.results || data).map(await mapper))
    //     }
    // }

    // async translateResponse(response, mapper = x => x) {
    //     // a bc response will always have 'meta' and 'data'
    //     // 'data' will sometimes be just an object, sometimes an array

        // return {
        //     meta: response.meta && response.meta.pagination && {
        //         total: response.meta.pagination.total,
        //         count: response.meta.pagination.count,
        //         limit: response.meta.pagination.per_page,
        //         offset: (response.meta.pagination.current_page - 1) * response.meta.pagination.per_page
        //     },
        //     results: await Promise.all(Array.ensureArray(response.data).map(await mapper))
        // }
    // }

    async translateResponse(response, mapper = x => x) {
        let results = (response.code || response.id) ? [response] : (response.categories || response.products)
        return {
            meta: response.pagination && {
                total: response.pagination.totalResults,
                count: results.length,
                limit: response.pagination.pageSize,
                offset: (response.pagination.currentPage - 1) * response.pagination.pageSize
            },
            results: await Promise.all(Array.ensureArray(results).map(await mapper))
        }
    }
}

// category operation
class HybrisCategoryOperation extends HybrisOperation {
    constructor(args, cred) {
        super(args, cred)
        this.uri = `catalogs/${this.cred.catalogId}/${this.cred.catalogVersion}/categories/${(args.id || "1")}`
        this.args = { 
            ...this.args,
            body: args.category && this.mapInput(args.category)
        }
    }

    mapInput(input) {
    }

    mapOutput(category) {
        return {
            id: category.id,
            name: category.name,
            slug: slugify(category.name, { lower: true }),
            children: _.map(category.subcategories, _.bind(this.mapOutput, this))
        }
    }
}
// end category operations

// product operation
class HybrisProductOperation extends HybrisOperation {
    constructor(args, cred) {
        super(args, cred)
        if (args.id || args.sku) {
            this.uri = `products/${(args.id || args.sku)}`
        }
        else if (args.keyword) {
            this.uri = `products/search?query=${args.keyword}`
        }
        else if (args.categoryId) {
            this.uri = `categories/${args.categoryId}/products`
        }
        else {
            this.uri = `products/search`
        }
        this.args = {
            ...this.args,
            fields: 'FULL',
            body: args.product && this.mapInput(args.product)
        }
    }

    mapOutput(prod) {
        return {
            ...prod,
            name: prod.name.stripHTML(),
            id: prod.code,
            slug: slugify(prod.name.stripHTML(), { lower: true }),
            shortDescription: prod.summary && prod.summary.stripHTML(),
            longDescription: prod.description && prod.description.stripHTML(),
            categories: _.map(prod.categories, cat => ({ id: cat.code, name: cat.name })),
            variants: [{
                sku: prod.code,
                prices: { list: prod.price && prod.price.formattedValue },
                images: [{ url: `${this.cred.imageUrlFormat.replace("{{id}}", prod.code)}` }],
                defaultImage: { url: `${this.cred.imageUrlFormat.replace("{{id}}", prod.code)}` }
            }]
        }
    }

    mapInput(input) {
    }
}
// end product operations

module.exports = {
    productOperation: (args, cred) => new HybrisProductOperation(args, cred),
    categoryOperation: (args, cred) => new HybrisCategoryOperation(args, cred),
}