// third party imports
import axios from 'axios';
import _ = require("lodash")

// load the bigcommerce configuration
let bcConfig = global.config.bigcommerce
let catalogApiUrl = `${bcConfig.apiUrl}/stores/${bcConfig.storeHash}/v3/catalog`

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

let mapProduct = prod => ({
    id: prod.id,
    name: prod.name,
    shortDescription: prod.description,
    longDescription: prod.description,
    variants: _.map(prod.variants, mapVariant)
})

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
    cat.products = <Product[]> await makeCatalogAPIRequest(`/products?categories:in=${cat.id}`, mapProduct)
    cat.children = await makeCatalogAPIRequest(`/categories?parent_id=${cat.id}`, cat => ({
        id: cat.id,
        name: cat.name
    }))
    return cat
}

class BigCommerceBackend implements CommerceBackend { 
    async getProducts() { 
        return await makeCatalogAPIRequest(`/products?include=images&include=variants`, mapProduct)
    }

    async getProductById(id) {
        return await makeCatalogAPIRequest(`/products/${id}?include=images&include=variants`, mapProduct)
    }

    async getProductBySku(sku) {
        return _.first(await makeCatalogAPIRequest(`/products?include=images&include=variants&sku=${sku}`, mapProduct))
    }

    async getProductBySlug(slug) {
        throw new Error('not implemented')
    }

    async searchProducts(searchText) {
        let products = <Product[]> await makeCatalogAPIRequest(`/products?include=images&include=variants&name:like=%${searchText}%`, mapProduct)
        return {
            products: await Promise.all(products.map(populateProductImages))
        }
    }

    async getCategories() {
        return await makeCatalogAPIRequest(`/categories?parent_id=0`, populateCategory)
    }

    async getCategoryById(id) {
        return await makeCatalogAPIRequest(`/categories/${id}`, populateCategory)
    }

    async getCategoryBySlug(slug) {
        throw new Error('not implemented')
    }
}

module.exports = new BigCommerceBackend()