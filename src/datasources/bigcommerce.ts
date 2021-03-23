import config from "../config/bigcommerce.json"

let catalogApiUrl = `${config.apiUrl}/stores/${config.storeHash}/v3/catalog`

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

let populateProductImages = async product => {
    let images = await makeCatalogAPIRequest(`/products/${product.id}/images`, mapImage);
    _.first(product.variants).images = images
    _.first(product.variants).defaultImage = _.first(images)
    return product
}

let makeCatalogAPIRequest = async (uri, mapper) => {
    const response = await axios(`${catalogApiUrl}${uri}`, {
        headers: {
            'X-Auth-Token': config.apiToken
        }
    });

    if (!Array.isArray(response.data.data)) {
        return await mapper(response.data.data)
    }
    else {
        return await Promise.all(response.data.data.map(await mapper))
    }
}

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
        get: async() => await makeCatalogAPIRequest(`/products?include=images`, mapProduct),
        getById: async id => await makeCatalogAPIRequest(`/products/${id}?include=images`, mapProduct),
        getBySku: async sku => _.first(await makeCatalogAPIRequest(`/products?include=images&sku=${sku}`, mapProduct)),
        getBySlug: async slug => {},
        search: async searchText => {
            let products = await makeCatalogAPIRequest(`/products?include=images&name:like=%${searchText}%`, mapProduct)
            return {
                products: await Promise.all(products.map(populateProductImages))
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