// 3rd party libs
const URI = require('urijs')
const _ = require('lodash')

const { formatMoneyString } = require('../../../util/locale-formatter')
const CommerceBackend = require('./index')

let mapImage = image => ({ url: image.url_standard })

let mapVariant = (prod, args) => variant => {
    let images = variant.image_url
        ? [{ url: variant.image_url }]
        : _.map(prod.images, mapImage)
    return {
        ...variant,
        prices: {
            list: formatMoneyString(
                variant.price || prod.price,
                args.locale,
                args.currency
            ),
            sale: formatMoneyString(
                variant.sale_price || prod.price,
                args.locale,
                args.currency
            )
        },
        defaultImage: _.first(images),
        attributes: variant.option_values.map(opt => ({
            name: opt.option_display_name.toLowerCase(),
            value: opt.label
        })),
        images
    }
}

class BigCommerceBackend extends CommerceBackend {
    constructor(cred, context) {
        super(cred, context)
        this.configs = {
            products: {
                uri: `products`,
                args: { include: 'images,variants' },
                mapper: args => async prod => ({
                    ...prod,
                    shortDescription: prod.description,
                    longDescription: prod.description,
                    variants: _.map(prod.variants, mapVariant(prod, args))
                }),
                postProcessor: async (args, products) => {
                    let categoryIds = _.uniq(_.flatMap(products, 'categories'))
                    let categories = await Promise.all(categoryIds.map(async id => await this.getOne('categories', { id })))
                    _.each(products, prod => {
                        prod.categories = _.map(prod.categories, id => _.find(categories, cat => cat.id === id))
                    })
                    return products
                }
            },

            categories: {
                uri: `categories`,
                mapper: args => x => x
            }
        }

        this.catalogApiUrl = `${this.cred.apiUrl}/stores/${this.cred.storeHash}/v3/catalog`
    }

    getRequestURL(config, args) {
        let uri = new URI(`${this.catalogApiUrl}/${config.uri}`)

        if (args && args.limit && args.offset) {
            args.page = Math.floor(args.offset / args.limit + 1)
            // delete args.offset
        }

        let queryArgs = _.omit(args, [
            'locale',
            'offset',
            'language',
            'country',
            'currency'
        ])
        uri.addQuery(queryArgs)
        return uri
    }

    async getHeaders() {
        return { 'X-Auth-Token': this.cred.apiToken }
    }

    async translateResults(data, mapper = args => x => x) {
        if (!Array.isArray(data.data)) {
            data = {
                data: [data.data],
                meta: {
                    pagination: {
                        total: 1,
                        count: 1,
                        per_page: 1,
                        current_page: 1
                    }
                }
            }
        }

        data.results = await Promise.all(data.data.map(await mapper))
        return data
    }

    // DAL maybe use tree api?
    // https://developer.bigcommerce.com/api-reference/store-management/catalog/category/getcategorytree
    async getCategoryHierarchy(parent, args) {
        // if we are looking up a category by slug or id, that should be the root node of our category hierarchy
        let filter = 
            args.id && (c => `${c.id}` === args.id) ||
            (c => c.parent_id === 0)

        let categories = _.get(await this.get('categories', args), 'results')

        let populateChildren = category => {
            category.children = _.filter(categories, c => c.parent_id === category.id)
            _.each(category.children, populateChildren)
            return category
        }

        return _.map(
            _.filter(categories, filter),
            populateChildren
        )
    }

    async getProductsForCategory(parent) {
        return (await this.get('products', { "categories:in": parent.id })).results
    }

    async getMeta(parent) {
        return {
            total: parent.meta.pagination.total,
            count: parent.meta.pagination.count,
            limit: parent.meta.pagination.per_page,
            offset:
                (parent.meta.pagination.current_page - 1) *
                parent.meta.pagination.per_page
        }
    }
}

module.exports = BigCommerceBackend
