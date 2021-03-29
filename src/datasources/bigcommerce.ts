// third party imports
import _ = require("lodash")
let config = require('../util/config')

const BigCommerceBackend = context => {
    // load the bigcommerce configuration
    let bc = context.backendClient

    // let getProducts         = async args => await bc.products.get({ opts: { include: 'images,variants', page: args.limit && (args.offset / args.limit) + 1, limit: args.limit }, mapper: mapProduct })
    let getProducts         = async args => await bc.products.get({ opts: { ...args, include: 'images,variants' }, mapper: mapProduct })
    let getProductById      = async args => await bc.products.get({ opts: { ...args, include: 'images,variants' }, mapper: mapProduct })
    let getProductBySku     = async args => await bc.products.get({ opts: { ...args, include: 'images,variants' }, mapper: mapProduct })
    let getProductBySlug    = async args => { throw new Error(`getProductBySlug not implemented in BigCommerce`) }

    let getCategories       = async args => await bc.categories.get({ opts: { ...args, parent_id: 0 }, mapper: populateCategory })

    let populateCategory = async cat => {
        cat.products = _.get(await getProducts({ "categories:in": cat.id }), 'results')
        cat.children = _.get(await bc.categories.get({ opts: { parent_id: cat.id }, mapper: cat => ({
            name: cat.name,
            id: cat.id
        }) }), 'results')

        // console.log(JSON.stringify(cat))
        return cat
    }

    // product methods
    // let searchProducts      = async args => {
    //     let products = <Product[]>await makeCatalogAPIRequest(`/products?include=images&include=variants&name:like=%${args.searchText}%`, mapProduct)
    //     return {
    //         products: await Promise.all(products.map(populateProductImages))
    //     }
    // }
    // end product methods

    // category methods
    // let getCategories       = async args => await makeCatalogAPIRequest(`/categories?parent_id=0`, populateCategory)
    // let getCategoryById     = async args => await makeCatalogAPIRequest(`/categories/${args.id}`, populateCategory)
    // let getCategoryBySlug   = async args => { throw new Error(`getProductBySlug not implemented in BigCommerce`) }
    // end category methods

    // mappers
    let mapImage = image => ({ url: image.url_standard })

    let mapProduct = prod => {
        return {
            id: prod.id,
            name: prod.name,
            shortDescription: prod.description,
            longDescription: prod.description,
            variants: _.map(prod.variants, mapVariant(prod))
        }
    }

    let mapVariant = prod => variant => {
        let images = variant.image_url ? [{ url: variant.image_url }] : _.map(prod.images, mapImage)
        return {
            id: variant.id,
            sku: variant.sku,
            prices: {
                list: variant.price || prod.price,
                sale: variant.sale_price || prod.price
            },
            defaultImage: _.first(images),
            images
        }
    }
    // end mappers

    /**
     * 
     * Typically, in order to populate image records on a product in BigCommerce, you'd use the ?include=images query string.
     * However, there's an issue when you use the name= filter where the backend appears to ignore your perfectly properly formatted request.
     * So, we have to request the product images and hydrate the product record.
     * 
    */
    // let populateProductImages: (Product) => Promise<Product> = async product => {
    //     let images = await makeCatalogAPIRequest(`/products/${product.id}/images`, mapImage);
    //     _.first(product.variants).images = images
    //     _.first(product.variants).defaultImage = _.first(images)
    //     return product
    // }

    return {
        getProducts,
        getProductById,
        getProductBySku,
        getProductBySlug,
        // searchProducts,

        getCategories,
        // getCategoryById,
        // getCategoryBySlug
    }
}

module.exports = context => BigCommerceBackend(context)