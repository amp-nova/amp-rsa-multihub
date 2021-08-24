const URI = require('urijs')
const _ = require('lodash')

const Operation = require('../../../operations/operation')
const slugify = require('slugify')

class HybrisOperation extends Operation {
    // constructor(cred) {
    //     super(cred)
    //     this.accessToken = null
    // }

    getRequest(args) {
        let uri = new URI(this.getURL(args))
        uri.addQuery(args)
        return uri.toString()
    }

    getBaseURL() {
        return `${this.config.cred.server}/occ/v2/${this.config.cred.baseSiteId}`
    }

    // as far as i can tell, there's no authentication required for the endpoints we need
    // async authenticate() {
    //     if (!this.accessToken) {
    //         let response = await axios.post(this.getOauthURL())
    //         this.accessToken = `${response.data.token_type} ${response.data.access_token}`
    //     }
    //     return this.accessToken
    // }

    getOauthURL() {
        return `${this.config.cred.server}/authorizationserver/oauth/token?
            client_id=${this.config.cred.clientId}&
            client_secret=${this.config.cred.clientSecret}&
            grant_type=password&
            username=${this.config.cred.username}&
            password=${this.config.cred.password}`
    }

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
    getRequestPath(args) {
        return `catalogs/${this.config.cred.catalogId}/${this.config.cred.catalogVersion}/categories/${(args.id || "1")}`        
    }

    export(args) {
        return category => { 
            return {
                id: category.id || category.code,
                name: category.name || category.code,
                slug: slugify(category.name || category.code, { lower: true }),
                children: _.map(category.subcategories, _.bind(this.export(args), this))
            }
        }
    }

    async post(args) {
        args = { 
            ...args,
            body: args.category && this.import(args.category)
        }
        return await super.post(args)
    }
}
// end category operations

// product operation
class HybrisProductOperation extends HybrisOperation {
    getRequestPath(args) {
        if (args.id || args.sku) {
            return `products/${(args.id || args.sku)}`
        }
        else if (args.keyword) {
            return `products/search?query=${args.keyword}`
        }
        else if (args.categoryId) {
            return `categories/${args.categoryId}/products`
        }
        else {
            return `products/search`
        }
    }

    // export: native format to common format
    export(args) {
        let categoryOperation = new HybrisCategoryOperation(this.config.cred)
        return prod => ({
            ...prod,
            name: prod.name.stripHTML(),
            id: prod.code,
            slug: slugify(prod.name.stripHTML(), { lower: true }),
            shortDescription: prod.summary && prod.summary.stripHTML(),
            longDescription: prod.description && prod.description.stripHTML(),
            categories: _.map(prod.categories, cat => { return categoryOperation.export(args)(cat) }),
            variants: [{
                sku: prod.code,
                prices: { list: prod.price && prod.price.formattedValue },
                images: [{ url: `${this.config.cred.imageUrlFormat.replace("{{id}}", prod.code)}` }],
                defaultImage: { url: `${this.config.cred.imageUrlFormat.replace("{{id}}", prod.code)}` }
            }],
            productType: 'product'
        })
    }

    async get(args) {
        args = {
            ...args,
            fields: 'FULL'
        }
        return await super.get(args)
    }

    async post(args) {
        args = {
            ...args,
            body: args.product && this.import(args.product)
        }
        return await super.post(args)
    }
}
// end product operations

module.exports = {
    productOperation: config => new HybrisProductOperation(config),
    categoryOperation: config => new HybrisCategoryOperation(config),
}