// 3rd party libs
const _ = require('lodash')

const URI = require('urijs');
const axios = require('axios')
const currency = require('currency.js')
const stringify = require('json-stringify-safe')

const { Operation } = require('@/server/operation')

const mapImage = image => image && ({ url: image.url })

class CommerceToolsOperation extends Operation {
    constructor(backend) {
        super(backend)
        this.accessToken = null
    }

    getBaseURL() {
        return `${this.backend.config.cred.api_url}/${this.backend.config.cred.project}`
    }

    getRequest(args) {
        let uri = new URI(this.getURL(args))

        let query = {
            limit: args.limit,
            offset: args.offset,
            where: args.where,
            filter: args.filter,
            ...args,
        }

        // add any filters based on the args
        uri.addQuery(query)

        return uri.toString()
    }

    localize(text) {
        if (text.label) {
            text = text.label
        }

        if (typeof text === 'string') {
            return text
        }

        return text[this.backend.config.context.language] || text['en'] || text[Object.keys(text)[0]]
    }

    async authenticate() {
        if (!this.accessToken) {
            let response = await axios.post(
                `${this.backend.config.cred.oauth_url}/oauth/token?grant_type=client_credentials&scope=${_.first(_.split(this.backend.config.cred.scope, ' '))}`, {}, {
                    auth: {
                        username: this.backend.config.cred.client_id,
                        password: this.backend.config.cred.client_secret
                    }
                }
            )
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
    constructor(config) {
        super(config)
    }

    export(args) {
        let self = this
        return function (category) {
            return {
                id: category.id,
                parent: category.parent,
                ancestors: category.ancestors,
                name: self.localize(category.name),
                slug: self.localize(category.slug)
            }
        }
    }

    getRequestPath(args) {
        return `categories`
    }

    async get(args) {
        return await super.get({
            ...args,
            limit: 500,
            where:
                args.slug && [`slug(${this.backend.config.context.language || 'en'}="${args.slug}") or slug(en="${args.slug}")`] ||
                args.id && [`id="${args.id}"`]
        })
    }
}
// end category operations

// cart discount operation
class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    constructor(config) {
        super(config)
    }

    getRequestPath(args) {
        return `cart-discounts`
    }
}
// end cart discount operations

// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    constructor(config) {
        super(config)
    }

    getRequestPath(args) {
        return (args.keyword || args.filter) ? `product-projections/search` : `product-projections`
    }

    async get(args) {
        if (args.all) {
            let getCategories = async (limit: number, offset: number) => {
                return await super.get({
                    ...args,
                    limit,
                    offset,
                    expand: ['categories[*]'],
                })
            }

            let results = []
            let total = -1

            while (total === -1 || results.length < total) {
                let response = await getCategories(100, results.length)
                results = results.concat(response.results)
                total = response.meta.total

                console.log(`[ ct ] retrieved products: ${results.length}/${total}`)
            }

            return {
                meta: {
                    total: results.length,
                    count: results.length
                },
                results
            }
        }
        else {
            console.log(JSON.stringify(args))

            return await super.get({
                ...args,
                expand: ['categories[*]'],
                priceCountry: this.backend.config.context.country,
                priceCurrency: this.backend.config.context.currency,
                [`text.${this.backend.config.context.language}`]: args.keyword,
                filter:
                    args.filter ||
                    args.productIds && [`id:${_.map(args.productIds.split(','), x => `"${x}"`).join(',')}`],
                where:
                    args.id && [`id="${args.id}"`] ||
                    args.slug && [`slug(${this.backend.config.context.language}="${args.slug}") or slug(en="${args.slug}")`] ||
                    args.sku && [`variants(sku="${args.sku}")`]
            })
        }
    }

    async post(args) {
        args = {
            ...args,
            body: import(args.product)
        }
        return await super.post(args)
    }

    export(args) {
        let self = this
        return function(product) {
            return {
                id: product.id,
                name: this.localize(product.name),
                slug: this.localize(product.slug),
                longDescription: product.metaDescription && this.localize(product.metaDescription),
                variants: _.map(_.concat(product.variants, [product.masterVariant]), variant => {
                    return {
                        sku: variant.sku || product.key,
                        prices: {
                            list: self.formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100),
                            sale: self.formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100)
                        },
                        images: _.map(variant.images, mapImage),
                        attributes: _.map(variant.attributes, att => ({ name: att.name, value: self.localize(att.value) }))
                    }
                }),
                categories: _.map(product.categories, function(cat) {
                    let category = cat.obj || cat
                    return {
                        id: category.id,
                        parent: category.parent,
                        ancestors: category.ancestors,
                        name: self.localize(category.name),
                        slug: self.localize(category.slug)
                    }
                }),
                productType: product.productType.id
            }
        }
    }

    async postProcessor(args) {
        let self = this
        return async function(products) {
            let segment = self.backend.config.context.segment
            if (!_.isEmpty(segment) && segment !== 'null' && segment !== 'undefined') {
                let discountOperation = new CommerceToolsCartDiscountOperation(self.backend)
                let cartDiscounts = (await discountOperation.get({})).getResults()
                let applicableDiscounts = _.filter(cartDiscounts, cd => cd.cartPredicate === `customer.customerGroup.key = "${segment.toUpperCase()}"`)

                return _.map(products, product => {
                    return {
                        ...product,
                        variants: _.map(product.variants, variant => {
                            let sale = currency(variant.prices.list).value
                            _.each(applicableDiscounts, discount => {
                                if (discount.target.type === 'lineItems') {
                                    let [predicateKey, predicateValue] = discount.target.predicate.split(" = ")
                                    if (discount.target.predicate === '1 = 1' || (predicateKey === 'productType.id' && `"${product.productType}"` === predicateValue)) {
                                        if (discount.value.type === 'relative') {
                                            // permyriad is pct off * 10000
                                            sale = sale * (1 - discount.value.permyriad / 10000)
                                        }
                                    }
                                }
                            })

                            variant.prices.sale = currency(sale).format()
                            return variant
                        })
                    }
                })
            }
            else {
                return products
            }
        }
    }
}

module.exports = {
    productOperation: backend => new CommerceToolsProductOperation(backend),
    categoryOperation: backend => new CommerceToolsCategoryOperation(backend),
}