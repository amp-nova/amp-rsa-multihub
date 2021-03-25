// third party imports
import axios from 'axios';
import _ = require("lodash")
let config = require('../util/config')

// load the bigcommerce configuration
let bcConfig = config.bigcommerce
let catalogApiUrl = `${bcConfig.apiUrl}/stores/${bcConfig.storeHash}/v3/catalog`

const BigCommerceBackend = context => {
    // product methods
    let getProducts = async () => await makeCatalogAPIRequest(`/products?include=images&include=variants`, mapProduct)
    let getProductById = async (id) => await makeCatalogAPIRequest(`/products/${id}?include=images&include=variants`, mapProduct)
    let getProductBySku = async (sku) => _.first(await makeCatalogAPIRequest(`/products?include=images&include=variants&sku=${sku}`, mapProduct))
    let getProductBySlug = async (slug) => { /* not implemented for BC */ }
    let searchProducts = async (searchText) => {
        let products = <Product[]>await makeCatalogAPIRequest(`/products?include=images&include=variants&name:like=%${searchText}%`, mapProduct)
        return {
            products: await Promise.all(products.map(populateProductImages))
        }
    }
    // end product methods

    // category methods
    let getCategories = async () => await makeCatalogAPIRequest(`/categories?parent_id=0`, populateCategory)
    let getCategoryById = async (id) => await makeCatalogAPIRequest(`/categories/${id}`, populateCategory)
    let getCategoryBySlug = async (slug) => { /* not implemented for BC */ }
    // end category methods

    // mappers
    let mapProduct = prod => ({
        id: prod.id,
        name: prod.name,
        shortDescription: prod.description,
        longDescription: prod.description,
        variants: _.map(prod.variants, mapVariant)
    })

    let mapImage = image => ({ url: image.url_standard })

    let mapVariant = variant => {
        let images = [{ url: variant.image_url }]
        return {
            id: variant.id,
            sku: variant.sku,
            prices: {
                list: variant.price
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
    let populateProductImages: (Product) => Promise<Product> = async product => {
        let images = await makeCatalogAPIRequest(`/products/${product.id}/images`, mapImage);
        _.first(product.variants).images = images
        _.first(product.variants).defaultImage = _.first(images)
        return product
    }

    // makes a request to the BC API with the given uri and formats the response data with the given mapper
    let makeCatalogAPIRequest = async (uri, mapper) => {
        const response = await axios(`${catalogApiUrl}${uri}`, {
            headers: {
                'X-Auth-Token': bcConfig.apiToken
            }
        });

        if (!Array.isArray(response.data.data)) {
            return await mapper(response.data.data)
        }
        else {
            return await Promise.all(response.data.data.map(await mapper))
        }
    }

    // hydrate the 'products' and 'children' records on category
    let populateCategory = async cat => {
        cat.products = <Product[]>await makeCatalogAPIRequest(`/products?categories:in=${cat.id}`, mapProduct)
        cat.children = await makeCatalogAPIRequest(`/categories?parent_id=${cat.id}`, cat => ({
            id: cat.id,
            name: cat.name
        }))
        return cat
    }

    return {
        getProducts,
        getProductById,
        getProductBySku,
        getProductBySlug,
        searchProducts,

        getCategories,
        getCategoryById,
        getCategoryBySlug
    } as CommerceBackend
}

module.exports = context => BigCommerceBackend(context)