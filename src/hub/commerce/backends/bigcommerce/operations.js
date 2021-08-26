const URI = require('urijs')
const _ = require('lodash')

const Operation = require('../../../operations/operation')
const { formatMoneyString } = require('../../../../util/locale-formatter')
const { findCategory } = require('../../../../util/helpers')

const mapImage = image => ({ url: image.url_standard })
const slugify = require('slugify')
require('../../../../util/helpers')

class BigCommerceOperation extends Operation {
    getBaseURL() {
        return `${this.config.cred.apiUrl}/stores/${this.config.cred.storeHash}/v3/catalog`
    }

    getRequest(args) {
        let uri = new URI(this.getURL(args))

        if (args && args.limit && args.offset) {
            args.page = Math.floor(args.offset / args.limit + 1)
            // delete args.offset
        }

        let queryArgs = _.omit(args, [
            'locale',
            'offset',
            'language',
            'country',
            'currency',
            'category',
            'product',
            'body',
            'slug',
            'method'
        ])

        uri.addQuery(queryArgs)
        return uri.toString()
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
            'X-Auth-Token': this.config.cred.apiToken,
            'Content-Type': `application/json` 
        }
    }
}

// category operation
class BigCommerceCategoryOperation extends BigCommerceOperation {
    getRequestPath(args) {
        return `categories/tree`
    }

    async post(args) {
        return await super.post({
            ...args,
            body: import(args.category)
        })
    }

    import(input) {
        return {
            name: input.name,
            parent_id: input.parentId
        }
    }

    export(args) {
        return this.mapCategory()
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
    getRequestPath(args) {
        return args.id ? `products/${args.id}` : `products`
    }

    async get(args) {
        return await super.get({
            ...args,
            include: 'images,variants'
        })
    }

    async post(args) {
        return await super.post({
            ...args,
            body: args.product && this.import(args.product)
        })
    }

    export(args) {
        return prod => ({
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
                images: variant.image_url ? [{ url: variant.image_url }] : _.map(prod.images, mapImage)
            })),
            productType: 'product'
        })
    }

    import(input) {
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

    postProcessor(args) {
        return async products => {
            let operation = new BigCommerceCategoryOperation(this.config.cred)
            let categories = (await operation.get({})).getResults()
            return _.map(products, prod => ({
                ...prod,
                categories: _.map(prod.categories, id => findCategory(categories, { id: `${id}` }))
            }))
        }
    }
}
// end product operations

module.exports = {
    productOperation: cred => new BigCommerceProductOperation(cred),
    categoryOperation: cred => new BigCommerceCategoryOperation(cred),
}