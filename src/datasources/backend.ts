import _ from "lodash"

class CommerceBackend {
    context;
    client;
    constructor(context) {
        this.context = context
        this.client = context.backendClient
    }

    validateArgs(args, type) {
        if (_.intersection(Object.keys(args), this.getLookupKeys(type)).length > 1) {
            throw new Error(`Exactly one of these parameters must be specified: [ ${this.getLookupKeys(type)} ]`)
        }
    }

    async getProducts(args) {
    }

    async getProduct(args) {
    }

    async getCategories(args) {
    }

    async getCategory(args) {
    }

    getLookupKeys(type) {
        return []
    }
}

export default CommerceBackend
