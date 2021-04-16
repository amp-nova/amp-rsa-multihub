const _ = require("lodash")
import CommerceBackend from "./backend"

class CommerceToolsBackend extends CommerceBackend {
    getLookupKeys(type) {
        switch(type) {
            case 'product':
                return ['sku', 'id', 'slug']
            case 'category':
                return ['id', 'slug']
            default:
                return []
        }
    }

    validateArgs(args, type) {
        super.validateArgs(args, type)

        let where = []
        if (args.id) {
            where = [`id="${args.id}"`]
        }
        else if (args.sku) {
            where = [`masterVariant(sku="${args.sku}")`]
        }
        else if (args.slug) {
            where = [`slug(${this.context.graphqlLocale}="${args.slug}")`]
        }
        return where
    }

    async getProducts(args) {
        if (args.keyword) {
            let localeKey = `text.${this.context.graphqlLocale || 'en'}`
            return await this.client.productProjectionsSearch.get({ ...args, [localeKey]: args.keyword }) 
        }
        else {
            return await this.client.productProjections.get({ ...args })
        }
    }

    async getProduct(args) {
        return await this.client.products.getOne(args)
    }

    async getCategories(args) {
        return await this.client.categories.get({ ...args, where: [`ancestors is empty`] })
    }

    async getCategory(args) {
        return await this.client.categories.getOne({ ...args, where: this.validateArgs(args, 'category') }) 
    }
}

module.exports = context => new CommerceToolsBackend(context)