// 3rd party libs
const _ = require('lodash')

const URI = require('urijs');
const axios = require('axios')

const { formatMoneyString } = require('../../../util/locale-formatter')
const CommerceBackend = require('./index')

const mapImage = image => image && ({ url: image.url })

const localize = (text, args) => {
    if (text.label) {
        text = text.label
    }

    if (typeof text === 'string') {
        return text
    }

    return text[args.locale] || text[args.language] || text['en'] || text[Object.keys(text)[0]]
}

const mapCategory = args => cat => {
    let category = cat.obj || cat
    return {
        ...category,
        name: localize(category.name, args),
        slug: localize(category.slug, args)
    }
}

const mapProduct = args => product => {
    return {
        ...product,
        name: localize(product.name, args),
        slug: localize(product.slug, args),
        longDescription: product.metaDescription && localize(product.metaDescription, args),
        variants: _.map(_.concat(product.variants, [product.masterVariant]), variant => ({
            ...variant,
            prices: { list: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, args.locale, args.currency) },
            images: _.map(variant.images, mapImage),
            attributes: _.map(variant.attributes, att => ({ name: att.name, value: localize(att.value, args) }))
        })),
        categories: _.map(product.categories, mapCategory(args))
    }
}

class CommerceToolsBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.configs = {
            products: {
                uri: args => `product-projections/search`,
                args: { expand: ['categories[*]'] },
                mapper: mapProduct,
                queryArgs: args => {
                    let [language, __] = args.locale.split('-')
                    return {
                        priceCountry: args.country,
                        priceCurrency: args.currency,
                        [`text.${language}`]: args.keyword,
                        where: 
                            args.id && [`id="${args.id}"`] ||
                            args.slug && [`slug(${language}="${args.slug}") or slug(en="${args.slug}")`] ||
                            args.sku && [`variants(sku="${args.sku}")`]
                    }
                }
            },
            categories: {
                uri: () => `categories`,
                args: { limit: 500 },
                mapper: mapCategory,
                queryArgs: args => {
                    let [language, __] = args.locale.split('-')
                    return {
                        where: 
                            args.slug && [`slug(${language}="${args.slug}") or slug(en="${args.slug}")`] ||
                            args.id && [`id="${args.id}"`]
                    }
                }
            }
        }

        this.accessToken = null
    }

    async authenticate() {
        if (!this.accessToken) {
            let response = await axios.post(
                `${this.cred.oauth_url}/oauth/token?grant_type=client_credentials&scope=${_.first(_.split(this.cred.scope, ' '))}`, {},
                {
                    auth: {
                        username: this.cred.client_id,
                        password: this.cred.client_secret
                    }
                }
            )
            // console.log(`[ ct ] access token: ${response.data.access_token}`)
            this.accessToken = `${response.data.token_type} ${response.data.access_token}`
        }
        return this.accessToken
    }

    getRequestURL(config, args) {
        let uri = new URI(`${this.cred.api_url}/${this.cred.project}/${config.uri(args)}`)

        let query = config.queryArgs && config.queryArgs(args) || {}
        query = {
            limit: args.limit,
            offset: args.offset,
            where: args.where,
            filter: args.filter,
            ...query,
        }

        // add any filters based on the args
        uri.addQuery(query)

        return uri
    }

    async getHeaders() {
        return { authorization: await this.authenticate() }
    }

    async getCategoryHierarchy(parent, args) {
        let filter = 
            args.id && (c => c.id === args.id) ||
            args.slug && (c => c.slug === args.slug) ||
            (c => c.ancestors.length === 0)

        let categories = (await this.get('categories', args)).results

        let populateChildren = category => {
            category.children = _.filter(categories, c => c.parent && c.parent.id === category.id)
            _.each(category.children, populateChildren)
            return category
        }

        return _.map(_.filter(categories, filter), populateChildren)
    }

    async getProductsForCategory(parent, args) {
        return (await this.get('products', { filter: args.full ? [`categories.id: subtree("${parent.id}")`] : [`categories.id: "${parent.id}"`] })).results
    }

    async getMeta(parent) {
        return parent
    }
}

module.exports = CommerceToolsBackend