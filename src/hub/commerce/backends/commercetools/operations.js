// 3rd party libs
const _ = require('lodash')

const URI = require('urijs');
const axios = require('axios')
const currency = require('currency.js')

const Operation = require('../../../operations/operation')

const { formatMoneyString } = require('../../../../util/locale-formatter')
const mapImage = image => image && ({ url: image.url })

class CommerceToolsOperation extends Operation {
    constructor(cred) {
        super(cred)
        this.accessToken = null
    }

    getBaseURL() {
        return `${this.cred.api_url}/${this.cred.project}`
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

    localize(text, args) {
        if (text.label) {
            text = text.label
        }

        if (typeof text === 'string') {
            return text
        }

        return text[args.locale] || text[args.language] || text['en'] || text[Object.keys(text)[0]]
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
    export(args) {
        return (category) => ({
            ...category,
            name: this.localize(category.name, args),
            slug: this.localize(category.slug, args)
        })
    }

    getRequestPath(args) {
        return `categories`
    }

    async get(args) {
        args = {
            ...args,
            limit: 500,
            where:
                args.slug && [`slug(${args.language}="${args.slug}") or slug(en="${args.slug}")`] ||
                args.id && [`id="${args.id}"`]
        }
        return await super.get(args)
    }
}
// end category operations

// cart discount operation
class CommerceToolsCartDiscountOperation extends CommerceToolsOperation {
    getRequestPath(args) {
        return `cart-discounts`
    }
}
// end cart discount operations

// product operation
class CommerceToolsProductOperation extends CommerceToolsOperation {
    getRequestPath(args) {
        return (args.keyword || args.filter) ? `product-projections/search` : `product-projections`
    }

    async get(args) {
        args = {
            ...args,
            expand: ['categories[*]'],
            priceCountry: args.country,
            priceCurrency: args.currency,
            [`text.${args.language}`]: args.keyword,
            where:
                args.id && [`id="${args.id}"`] ||
                args.slug && [`slug(${args.language}="${args.slug}") or slug(en="${args.slug}")`] ||
                args.sku && [`variants(sku="${args.sku}")`]
        }
        return await super.get(args)
    }

    async post(args) {
        args = {
            ...args,
            body: import(args.product)
        }
        return await super.post(args)
    }

    export(args) {
        return product => ({
            ...product,
            name: this.localize(product.name, args),
            slug: this.localize(product.slug, args),
            longDescription: product.metaDescription && this.localize(product.metaDescription, args),
            variants: _.map(_.concat(product.variants, [product.masterVariant]), variant => {
                return {
                    ...variant,
                    sku: variant.sku || product.key,
                    prices: { list: formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100, args.locale, args.currency) },
                    images: _.map(variant.images, mapImage),
                    attributes: _.map(variant.attributes, att => ({ name: att.name, value: this.localize(att.value, args) }))
                }
            }),
            categories: _.map(product.categories, cat => {
                let category = cat.obj || cat
                return {
                    ...category,
                    name: this.localize(category.name, args),
                    slug: this.localize(category.slug, args)
                }
            }),
            productType: product.productType.id
        })
    }

    async postProcessor(args) {
        return async products => {
            if (args.customerSegment) {
                let discountOperation = new CommerceToolsCartDiscountOperation(this.cred)
                let cartDiscounts = (await discountOperation.get({})).getResults()
                let applicableDiscounts = _.filter(cartDiscounts, cd => args.customerSegment && cd.cartPredicate === `customer.customerGroup.key = "${args.customerSegment.toUpperCase()}"`)

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
    productOperation: cred => new CommerceToolsProductOperation(cred),
    categoryOperation: cred => new CommerceToolsCategoryOperation(cred),
}