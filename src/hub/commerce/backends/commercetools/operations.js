
// 3rd party libs
const _ = require('lodash')

const URI = require('urijs');
const axios = require('axios')
const Operation = require('../../../operations/operation')

const { formatMoneyString } = require('../../../../util/locale-formatter')
const mapImage = image => image && ({ url: image.url })

class CommerceToolsOperation extends Operation {
    constructor(args, cred) {
        super(args, cred)
        this.accessToken = null
    }

    getRequest() {
        let url = this.getRequestURL()
        return url.toString()
    }

    getRequestURL() {
        let uri = new URI(`${this.cred.api_url}/${this.cred.project}/${this.uri}`)

        let query = {
            limit: this.args.limit,
            offset: this.args.offset,
            where: this.args.where,
            filter: this.args.filter,
            ...this.args,
        }

        // add any filters based on the args
        uri.addQuery(query)

        return uri
    }

    localize(text) {
        if (text.label) {
            text = text.label
        }
    
        if (typeof text === 'string') {
            return text
        }
    
        return text[this.args.locale] || text[this.args.language] || text['en'] || text[Object.keys(text)[0]]
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

    async translateResponse(data, mapper = (x => x)) {
        // a commercetools response will be either a single object, or an array in 'results'
        // if it is an array, limit, count, total, and offset are provided on the object

        return {
            meta: data.limit && {
                limit: data.limit,
                count: data.count,
                offset: data.offset,
                total: data.total
            },
            results: await Promise.all((data.results || data).map(await mapper))
        }
    }

    async getHeaders() {
        return { authorization: await this.authenticate() }
    }
}

// category operation
class CommerceToolsCategoryOperation extends CommerceToolsOperation {
    constructor(args, cred) {
        super(args, cred)
        this.uri = `categories`

        this.args = { 
            ...this.args,
            limit: 500,
            where: 
                this.args.slug && [`slug(${this.args.language}="${this.args.slug}") or slug(en="${this.args.slug}")`] ||
                this.args.id && [`id="${this.args.id}"`]
        }
    }

    mapOutput(category) {
        return {
            ...category,
            name: this.localize(category.name),
            slug: this.localize(category.slug)
        }
    }
}
// end category operations

// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    constructor(args, cred) {
        super(args, cred)
        this.uri = (args.id || args.slug) ? `product-projections` : `product-projections/search`
        this.args = {
            ...this.args,
            expand: ['categories[*]'],
            priceCountry: this.args.country,
            priceCurrency: this.args.currency,
            [`text.${this.args.language}`]: this.args.keyword,
            where: 
                this.args.id && [`id="${this.args.id}"`] ||
                this.args.slug && [`slug(${this.args.language}="${this.args.slug}") or slug(en="${this.args.slug}")`] ||
                this.args.sku && [`variants(sku="${this.args.sku}")`]
        }
    }

    mapOutput(product) {
        return {
            ...product,
            name: this.localize(product.name),
            slug: this.localize(product.slug),
            longDescription: product.metaDescription && this.localize(product.metaDescription),
            variants: _.map(_.concat(product.variants, [product.masterVariant]), variant => ({
                ...variant,
                prices: { list: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, this.args.locale, this.args.currency) },
                images: _.map(variant.images, mapImage),
                attributes: _.map(variant.attributes, att => ({ name: att.name, value: this.localize(att.value) }))
            })),
            categories: _.map(product.categories, cat => {
                let category = cat.obj || cat
                return {
                    ...category,
                    name: this.localize(category.name),
                    slug: this.localize(category.slug)
                }            
            })
        }
    }

    mapInput(input) {
        return {
        }
    }
}

class CommerceToolsGetProductOperation extends CommerceToolsProductOperation {
    constructor(args, cred) {
        super(args, cred)

        this.args = {
            ...this.args,
            expand: ['categories[*]'],
            priceCountry: this.args.country,
            priceCurrency: this.args.currency,
            [`text.${this.args.language}`]: this.args.keyword,
            where: 
                this.args.id && [`id="${this.args.id}"`] ||
                this.args.slug && [`slug(${this.args.language}="${this.args.slug}") or slug(en="${this.args.slug}")`] ||
                this.args.sku && [`variants(sku="${this.args.sku}")`]
        }
    }
}

class CommerceToolsPutProductOperation extends CommerceToolsProductOperation {
    constructor(args, cred) {
        super(args, cred)
        this.method = 'post'
        this.args = {
            ...this.args,
            body: this.mapInput(args.product)
        }
    }
}

module.exports = {
    productOperation: (args, cred) => new CommerceToolsProductOperation(args, cred),
    categoryOperation: (args, cred) => new CommerceToolsCategoryOperation(args, cred),
}