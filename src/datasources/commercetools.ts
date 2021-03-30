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

        if (args.id) {
            return [`id="${args.id}"`]
        }
        else if (args.sku) {
            return [`masterVariant(sku="${args.sku}")`]
        }
        else if (args.slug) {
            return [`slug(${this.context.graphqlLocale}="${args.slug}")`]
        }
        return []
    }

    async getProducts(args) {
        if (args.keyword) {
            let localeKey = `text.${this.context.graphqlLocale || 'en'}`
            return await this.client.productProjectionsSearch.get({ expand: ['categories[*]'] }, { ...args, [localeKey]: args.keyword }) 
        }
        else {
            return await this.client.productProjections.get({ expand: ['categories[*]'] }, args)
        }
    }

    async getProduct(args) {
        let where = this.validateArgs(args, 'product')
        return await this.client.productProjections.get({ expand: ['categories[*]'], where }, args)
    }

    async getCategories(args) {
        return await this.client.categories.get({ where: [`ancestors is empty`] }, args)
    }

    async getCategory(args) {
        let where = this.validateArgs(args, 'category')
        return await this.client.categories.get({ where }, args)
    }
}

module.exports = context => new CommerceToolsBackend(context)