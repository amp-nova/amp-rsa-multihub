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
let populateProductImages = async product => {
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
    cat.products = await makeCatalogAPIRequest(`/products?categories:in=${cat.id}`, mapProduct)
    cat.children = await makeCatalogAPIRequest(`/categories?parent_id=${cat.id}`, cat => ({
        id: cat.id,
        name: cat.name
    }))
    return cat
}

const BigCommerce = {
    products: {
        get: async() => await makeCatalogAPIRequest(`/products?include=images&include=variants`, mapProduct),
        getById: async id => await makeCatalogAPIRequest(`/products/${id}?include=images&include=variants`, mapProduct),
        getBySku: async sku => _.first(await makeCatalogAPIRequest(`/products?include=images&include=variants&sku=${sku}`, mapProduct)),
        getBySlug: async slug => { /* not implemented as BC does not have a product slug */ },
        search: async searchText => {
            let products = await makeCatalogAPIRequest(`/products?include=images&include=variants&name:like=%${searchText}%`, mapProduct)
            return {
                products: await Promise.all(products.map(populateProductImages))
            }
        },
    },

    categories: {
        get: async() => await makeCatalogAPIRequest(`/categories?parent_id=0`, populateCategory),
        getById: async id => await makeCatalogAPIRequest(`/categories/${id}`, populateCategory),
        getBySlug: async slug => { /* not implemented as BC does not have a category slug */ }
    }
}

module.exports = BigCommerce