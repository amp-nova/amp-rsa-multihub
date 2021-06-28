const URI = require('urijs')
const _ = require('lodash')
const axios = require('axios')

const CommerceBackend = require('./index')

class HybrisBackend extends CommerceBackend {
    mapProduct = args => prod => ({
        ...prod,
        name: prod.name.stripHTML(),
        id: prod.code,
        shortDescription: prod.summary,
        longDescription: prod.description,
        variants: [{
            sku: prod.code,
            prices: { list: prod.price.formattedValue },
            images: _.map(prod.images, image => ({ url: `${this.cred.server}${image.url}` }))
        }]
    })

    mapCategory = args => category => ({
        id: category.id,
        name: category.name || category.id,
        slug: category.id,
        children: _.map(category.subcategories, this.mapCategory(args))
    })
    
    constructor(cred, context) {
        super(cred, context)
        this.configs = {
            products: {
                uri: args => {
                    if (args.id || args.sku) {
                        return `products/${(args.id || args.sku)}`
                    }
                    else if (args.keyword) {
                        return `products/search?query=${args.keyword}`
                    }
                    return `products/search`
                },
                args: { fields: 'FULL' },
                mapper: this.mapProduct
            },

            categories: {
                uri: args => `catalogs/${cred.catalogId}/${cred.catalogVersion}/${ args.id ? `categories/${args.id}` : `` }`,
                mapper: this.mapCategory
            },

            productsForCategory: {
                uri: args => `categories/${args.id}/products`,
                mapper: this.mapProduct
            }
        }
        this.accessToken = null
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

    getRequestURL(config, args) {
        let uri = new URI(`${this.getBaseURL()}/${config.uri(args)}`)

        // if (args && args.limit && args.offset) {
        //     args.page = Math.floor(args.offset / args.limit + 1)
        //     // delete args.offset
        // }

        // let queryArgs = _.omit(args, [
        //     'locale',
        //     'offset',
        //     'language',
        //     'country',
        //     'currency'
        // ])

        uri.addQuery(config.args || {})

        return uri
    }

    async translateResults(data, mapper = (args => x => x)) {
        data.results = data.categories || data.products
        return await super.translateResults(data, mapper)
    }

    async getCategoryHierarchy(parent, args) {
        return _.get(await this.get('categories', args), 'results')
    }

    // async getHeaders() {
    //     return { authorization: await this.authenticate() }
    // }

    async getProductsForCategory(parent, args) {
        return _.get(await this.get('productsForCategory', { id: parent.id }), 'results')
    }

    async getMeta(parent, args, context, info) {
        return {
            total: parent.pagination.totalResults,
            count: parent.pagination.totalResults,
            limit: parent.pagination.pageSize,
            offset:
                (parent.pagination.currentPage - 1) *
                parent.pagination.pageSize
        }
    }
}

module.exports = HybrisBackend