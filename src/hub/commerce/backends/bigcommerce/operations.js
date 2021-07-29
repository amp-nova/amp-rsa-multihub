const URI = require('urijs')
const _ = require('lodash')
const uuid = require('uuid')

const Operation = require('../../../operations/operation')
const { formatMoneyString } = require('../../../../util/locale-formatter')
const { findCategory } = require('../../../../util/helpers')

const mapImage = image => ({ url: image.url_standard })
const slugify = require('slugify')
require('../../../../util/helpers')

class BigCommerceOperation extends Operation {
    getRequestURL() {
        let uri = new URI(`${this.cred.apiUrl}/stores/${this.cred.storeHash}/v3/catalog/${this.uri}`)

        if (this.args && this.args.limit && this.args.offset) {
            this.args.page = Math.floor(this.args.offset / this.args.limit + 1)
            // delete args.offset
        }

        let queryArgs = _.omit(this.args, [
            'locale',
            'offset',
            'language',
            'country',
            'currency',
            'category',
            'product',
            'body',
            'slug'
        ])

        uri.addQuery(queryArgs)
        return uri
    }
    
    async translateResponse(response, mapper = x => x) {
        // a bc response will always have 'meta' and 'data'
        // 'data' will sometimes be just an object, sometimes an array

        return {
            meta: response.meta && response.meta.pagination && {
                total: response.meta.pagination.total,
                count: response.meta.pagination.count,
                limit: response.meta.pagination.per_page,
                offset: (response.meta.pagination.current_page - 1) * response.meta.pagination.per_page
            },
            results: await Promise.all(Array.ensureArray(response.data).map(await mapper))
        }
    }

    async getHeaders() {
        return {
            'X-Auth-Token': this.cred.apiToken ,
            'Content-Type': `application/json` 
        }
    }
}

// category operation
class BigCommerceCategoryOperation extends BigCommerceOperation {
    constructor(args, cred) {
        super(args, cred)
        this.uri = `categories/tree`
        this.args = { 
            ...this.args,
            body: args.category && this.mapInput(args.category)
        }
    }

    mapInput(input) {
        return {
            name: input.name,
            parent_id: input.parentId
        }
    }

    mapOutput(cat) {
        return this.mapCategory()(cat)
    }

    mapCategory(parentSlug) {
        var self = this
        return function(cat) {
            let catSlug = slugify(cat.name, { lower: true })
            let slug = parentSlug ? `${parentSlug}-${catSlug}` : catSlug
            return {
                id: `${cat.id}`,
                name: cat.name,
                slug,
                parentId: `${cat.parent_id}`,
                children: _.map(cat.children, _.bind(self.mapCategory(slug), self))
            }
        }
    }
}
// end category operations

// product operation
class BigCommerceProductOperation extends BigCommerceOperation {
    constructor(args, cred) {
        super(args, cred)

        if (uuid.validate(this.args.id)) {
            this.args.id = '5529'
        }

        this.uri = args.id ? `products/${this.args.id}` : `products`
        this.args = {
            ...this.args,
            include: 'images,variants',
            body: args.product && this.mapInput(args.product)
        }
    }

    mapOutput(prod) {
        return {
            ...prod,
            shortDescription: prod.description,
            longDescription: prod.description,
            slug: slugify(prod.name, { lower: true, remove: /\"/g }),
            variants: _.map(prod.variants, variant => ({
                ...variant,
                prices: {
                    list: formatMoneyString(variant.price || prod.price),
                    sale: formatMoneyString(variant.sale_price || prod.price)
                },
                attributes: variant.option_values.map(opt => ({
                    name: opt.option_display_name.toLowerCase(),
                    value: opt.label
                })),
                images: variant.image_url
                    ? [{ url: variant.image_url }]
                    : _.map(prod.images, mapImage)
            }))
        }
    }

    mapInput(input) {
        return {
            // required BC fields
            name: input.name,
            type: 'physical',
            weight: 0,
            sku: input.sku,
            price: _.first(input.variants).prices.list,
            categories: input.categories,
            variants: _.map(input.variants, variant => ({
                sku: variant.sku,
                price: variant.prices.list,
                // image_url: variant.defaultImage.url,
                option_values: _.map(_.filter(variant.attributes, ({ name, value }) => value), attribute => ({
                    option_display_name: attribute.name,
                    label: attribute.value                            
                }))
            })),
            images: _.flatMap(input.images, x => ({ image_url: x.url, is_thumbnail: true })),
        }
    }

    async postProcessor(products) {
        let operation = new BigCommerceCategoryOperation({}, this.cred)
        let categories = _.get(await operation.get(), 'results')
        _.each(products, prod => {
            prod.categories = _.map(prod.categories, id => findCategory(categories, { id: `${id}` }))
        })
        return products
    }
}
// end product operations

module.exports = {
    productOperation: (args, cred) => new BigCommerceProductOperation(args, cred),
    categoryOperation: (args, cred) => new BigCommerceCategoryOperation(args, cred),
}