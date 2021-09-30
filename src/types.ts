import { Product, Category } from "amp-rsa-types";

export type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
}

// @ArgsType()
// export class CommonArgs {
//     // @Field({ nullable: true })
//     // locale?: string

//     // @Field({ nullable: true })
//     // currency?: string

//     // @Field({ nullable: true })
//     // segment?: string;
// }

// @ArgsType()
// export class ListArgs extends CommonArgs {
//     @Field({ nullable: true })
//     limit?: number

//     @Field({ nullable: true })
//     offset?: number
// }

// export class Context {
//     backendKey: string
//     commercehub: any
// }

// @ArgsType()
// export class GetCategoryArgs extends CommonArgs {
//     @Field({ nullable: true })
//     id?: string

//     @Field({ nullable: true })
//     slug?: string
// }

// @ArgsType()
// export class GetCategoryProductArgs extends CommonArgs {
//     @Field({ nullable: true })
//     full?: boolean

//     @Field({ nullable: true })
//     segment?: string
// }

// @ArgsType()
// export class GetProductsArgs extends ListArgs {
//     @Field({ nullable: true })
//     keyword?: string

//     @Field({ nullable: true })
//     segment?: string

//     @Field({ nullable: true })
//     productIds?: string
// }

// @ArgsType()
// export class GetProductArgs extends CommonArgs {
//     @Field({ nullable: true })
//     id?: string

//     @Field({ nullable: true })
//     sku?: string

//     @Field({ nullable: true })
//     slug?: string

//     @Field({ nullable: true })
//     segment?: string
// }

// @ArgsType()
// export class GetAttributeArgs {
//     @Field()
//     name: string
// }

export class CommonArgs {
}

export class ListArgs extends CommonArgs {
    limit?: number
    offset?: number
}

export class Context {
    backendKey: string
    commercehub: any
}

export class GetCategoryArgs extends CommonArgs {
    id?: string
    slug?: string
}

export class GetCategoryProductArgs extends CommonArgs {
    full?: boolean
    segment?: string
}

export class GetProductsArgs extends ListArgs {
    keyword?: string
    segment?: string
    productIds?: string
}

export class GetProductArgs extends CommonArgs {
    id?: string
    sku?: string
    slug?: string
    segment?: string
}

export class GetAttributeArgs {
    name: string
}

export class QueryContext {
    args:       any
    locale:     string
    language:   string
    country:    string
    currency:   string
    segment:    string
    appUrl:     string

    constructor(args?: any, locale?: string, language?: string, country?: string, currency?: string, segment?: string, appUrl?: string) {
        this.args = args || {}
        this.locale = locale || 'en-US'
        this.language = language || 'en'
        this.country = country || 'US'
        this.currency = currency || 'USD'
        this.segment = segment || ''
        this.appUrl = appUrl || ''
    }
}

export class CommerceClient {
    async getProducts(context: QueryContext): Promise<Product[]> {
        throw new Error('Subclasses of CommerceClient must implement getProducts(context: QueryContext)')
    }

    async getProduct(context: QueryContext): Promise<Product> {
        throw new Error('Subclasses of CommerceClient must implement getProduct(context: QueryContext)')
    }

    async getCategories(context: QueryContext): Promise<Category[]> {
        throw new Error('Subclasses of CommerceClient must implement getCategories(context: QueryContext)')
    }

    async getCategory(context: QueryContext): Promise<Category> {
        throw new Error('Subclasses of CommerceClient must implement getCategory(context: QueryContext)')
    }
}

export default { QueryContext }