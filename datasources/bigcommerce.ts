let apiUrl = `https://api.bigcommerce.com`
let storeHash = `ivhpe1uqls`
let catalogApiUrl = `${apiUrl}/stores/${storeHash}/v3/catalog`
let apiToken = `mgr4tatg4kainixjw8cgts10is2ka0y`

import axios from 'axios';
import _ = require("lodash")

let mapImage = image => ({ url: image.url_standard })
let mapProduct = prod => ({
    id: prod.id,
    name: prod.name,
    shortDescription: prod.description,
    longDescription: prod.description,
    variants: [{
        id: prod.id,
        sku: prod.sku,
        prices: {
            list: prod.price
        },
        defaultImage: !_.isEmpty(prod.images) && mapImage(_.first(prod.images)),
        images: _.map(prod.images, mapImage)
    }]
})

let bcHeaders = {
    headers: {
        'X-Auth-Token': apiToken
    }
}

let makeCatalogAPIRequest = async (uri, mapper) => {
    const response = await axios(`${catalogApiUrl}${uri}`, bcHeaders);
    // console.log(JSON.stringify(response.data.data))
    if (!Array.isArray(response.data.data)) {
        return await mapper(response.data.data)
    }
    else {
        return await Promise.all(response.data.data.map(await mapper))
    }
}

let populateCategory = async cat => {
    // get child products
    const productResponse = await axios(`${catalogApiUrl}/products?categories:in=${cat.id}`, bcHeaders);
    cat.products = _.map(productResponse.data.data, mapProduct)

    const categoryResponse = await axios(`${catalogApiUrl}/categories?parent_id=${cat.id}`, bcHeaders);
    cat.children = _.map(categoryResponse.data.data, cat => ({
        id: cat.id,
        name: cat.name
    }))

    return cat
}

const BigCommerce = {
    products: {
        get: async() => await makeCatalogAPIRequest(`/products?include=images`, mapProduct),
        getById: async id => await makeCatalogAPIRequest(`/products/${id}?include=images`, mapProduct),
        getBySku: async sku => _.first(await makeCatalogAPIRequest(`/products?include=images&sku=${sku}`, mapProduct)),
        getBySlug: async slug => {},
        search: async searchText => {
            let products = await makeCatalogAPIRequest(`/products?include=images&name:like=%${searchText}%`, mapProduct)

            products = await Promise.all(products.map(async product => {
                let images = await makeCatalogAPIRequest(`/products/${product.id}/images`, mapImage);
                _.first(product.variants).images = images
                _.first(product.variants).defaultImage = _.first(images)
                return product
            }))

            return {
                products
            }
        },
    },

    categories: {
        get: async() => await makeCatalogAPIRequest(`/categories`, populateCategory),
        getById: async id => await makeCatalogAPIRequest(`/categories/${id}`, populateCategory),
        getBySlug: async slug => {}
    }
}

module.exports = BigCommerce