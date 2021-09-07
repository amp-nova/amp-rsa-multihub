import URI from 'urijs'
import _ from 'lodash'
import atob from 'atob'

const { Operation } = require('../../../operations/operation')
const slugify = require('slugify')

class HybrisOperation extends Operation {
    constructor(config) {
        super(config)
    }

    getRequest(args) {
        let uri = new URI(this.getURL(args))
        args.pageSize = args.limit
        args.currentPage = args.offset
        uri.addQuery(args)
        return uri.toString()
    }

    getBaseURL() {
        return `${this.backend.config.cred.server}/occ/v2/${this.backend.config.cred.baseSiteId}`
    }

    getOauthURL() {
        return `${this.backend.config.cred.server}/authorizationserver/oauth/token?
            client_id=${this.backend.config.cred.clientId}&
            client_secret=${this.backend.config.cred.clientSecret}&
            grant_type=password&
            username=${this.backend.config.cred.username}&
            password=${this.backend.config.cred.password}`
    }

    async translateResponse(response, mapper = x => x) {
        let results = (response.code || response.id) ? [response] : (response.categories || response.products)
        results = Array.isArray(results) ? results : [results]
        return {
            meta: response.pagination && {
                total: response.pagination.totalResults,
                count: results.length,
                limit: response.pagination.pageSize,
                offset: (response.pagination.currentPage - 1) * response.pagination.pageSize
            },
            results: await Promise.all(results.map(await mapper))
        }
    }
}

// category operation
class HybrisCategoryOperation extends HybrisOperation {
    constructor(config) {
        super(config)
    }

    getRequestPath(args) {
        return `catalogs/${this.backend.config.cred.catalogId}/${this.backend.config.cred.catalogVersion}/categories/${(args.id || "1")}`
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

const imageContainer = (cred) => {
    let images = []
    return {
        addImage: image => {
            let [__, blob] = image.url.split('=')
            let decoded = atob(blob)
            let [sysdir, ___, size, imageType, imagePath, ____] = decoded.split('|')
            image.size = parseInt(size)
            images.push(image)
        },
        toUrl: () => ({ 
            url: `${cred.server}${_.first(_.reverse(_.sortBy(images, 'size'))).url}`,
            large: `${cred.server}${_.first(_.reverse(_.sortBy(images, 'size'))).url}`,
            thumb: `${cred.server}${_.first(_.sortBy(images, 'size')).url}`
        })
    }
}

// product operation
class HybrisProductOperation extends HybrisOperation {
    constructor(config) {
        super(config)
    }

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
        let categoryOperation = new HybrisCategoryOperation(this.backend.config.cred)
        return prod => {
            let primaryImage = null
            let gallery: any = {}

            if (!_.isEmpty(prod.images)) {
                primaryImage = imageContainer(this.backend.config.cred)

                _.each(prod.images, image => {
                    let galleryImage = gallery[image.galleryIndex] || imageContainer(this.backend.config.cred)
                    let source = image.imageType === 'PRIMARY' ? primaryImage : galleryImage
                    source.addImage(image)

                    if (image.imageType === 'GALLERY') {
                        gallery[image.galleryIndex] = source
                    }
                })
            }

            if (_.isEmpty(gallery) && primaryImage) {
                gallery.primary = primaryImage
            }

            return {
                ...prod,
                name: prod.name.stripHTML(),
                id: prod.code,
                slug: slugify(prod.name.stripHTML(), { lower: true }),
                shortDescription: prod.summary && prod.summary.stripHTML(),
                longDescription: prod.description && prod.description.stripHTML(),
                categories: _.map(prod.categories, cat => { return categoryOperation.export(args)(cat) }),
                variants: [{
                    sku: prod.code,
                    prices: { list: prod.price && prod.price.formattedValue, sale: prod.price && prod.price.formattedValue },
                    images: _.map(_.values(gallery), g => g.toUrl()),
                    defaultImage: primaryImage && primaryImage.toUrl()
                }],
                productType: 'product'
            }
        }
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