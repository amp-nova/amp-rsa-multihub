// third party imports
import _ = require("lodash")
import CommerceBackend from "./backend"

class BigCommerceBackend extends CommerceBackend {
    getLookupKeys(type) {
        switch(type) {
            case 'product':
                return ['sku', 'id']
            case 'category':
                return ['id']
            default:
                return []
        }
    }

    validateArgs(args, type) {
        super.validateArgs(args, type)
        if (args.slug) {
            throw new Error(`slug lookup not available for resource [ ${type} ] in BigCommerce`)
        }
        return []
    }

    async getProducts(args) {
        return await this.client.products.get({ ...args, include: 'images,variants' })
    }

    async getProduct(args) {
        this.validateArgs(args, 'product')
        return await this.client.products.getOne({ ...args, include: 'images,variants' }) 
    }

    async getCategories(args) {
        return await this.client.categories.get({ ...args, parent_id: 0 })
    }

    async getCategory(args) {
        this.validateArgs(args, 'category')
        return await this.client.categories.getOne({ ...args })
    }
}

module.exports = context => {
    return new BigCommerceBackend(context)
}