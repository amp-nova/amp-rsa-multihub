import { ArgsType, Field, ObjectType } from "type-graphql";
import { logger } from "./server/util/logger";

@ObjectType()
export class Prices {
    @Field({ nullable: true })
    sale?: string

    @Field({ nullable: true })
    list?: string
}

@ObjectType()
export class ProductImage {
    @Field()
    url: string

    @Field({ nullable: true })
    large?: string

    @Field({ nullable: true })
    thumb?: string
}

@ObjectType()
export class ResultsMeta {
    @Field()
    limit: number

    @Field()
    offset: number

    @Field()
    count: number

    @Field()
    total: number
}

@ObjectType()
export class ProductResults {
    @Field()
    meta: ResultsMeta

    @Field(type => [Product])
    results: [Product]
}

@ObjectType()
export class CategoryResults {
    @Field()
    meta: ResultsMeta

    @Field(type => [Category])
    results: [Category]
}

@ObjectType()
export class Identifiable {
    @Field()
    id: string
}

@ObjectType()
export class CommerceObject extends Identifiable {
    @Field()
    slug: string

    @Field()
    name: string

    @Field()
    raw: string
}

@ObjectType()
export class Product extends CommerceObject {
    @Field({ nullable: true })
    shortDescription?: string

    @Field({ nullable: true })
    longDescription?: string

    @Field(type => [Category])
    categories: Category[]

    @Field(type => [Variant])
    variants: Variant[]

    @Field()
    productType: string
}

@ObjectType()
export class Attribute {
    @Field()
    name: string

    @Field()
    value: string
}

@ObjectType()
export class Variant extends Identifiable {
    @Field()
    sku: string

    @Field()
    prices: Prices

    @Field({ nullable: true })
    defaultImage?: ProductImage

    @Field(type => [ProductImage])
    images: ProductImage[]

    @Field(type => [Attribute])
    attributes: Attribute[]

    color?: string
    size?: string
    articleNumberMax?: string
}

@ObjectType()
export class Category extends CommerceObject {
    @Field(type => [Category])
    children: Category[]

    @Field(type => [Product])
    products: Product[]
}

@ObjectType()
export class SearchResult {
    @Field(type => [Product])
    products: Product[]
}

export type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
}

@ArgsType()
export class CommonArgs {
    // @Field({ nullable: true })
    // locale?: string

    // @Field({ nullable: true })
    // currency?: string

    // @Field({ nullable: true })
    // segment?: string;
}

@ArgsType()
export class ListArgs extends CommonArgs {
    @Field({ nullable: true })
    limit?: number

    @Field({ nullable: true })
    offset?: number
}

export class Context {
    backendKey: string
    commercehub: any
}

@ArgsType()
export class GetCategoryArgs extends CommonArgs {
    @Field({ nullable: true })
    id?: string

    @Field({ nullable: true })
    slug?: string
}

@ArgsType()
export class GetCategoryProductArgs extends CommonArgs {
    @Field({ nullable: true })
    full?: boolean

    @Field({ nullable: true })
    segment?: string
}

@ArgsType()
export class GetProductsArgs extends ListArgs {
    @Field({ nullable: true })
    keyword?: string

    @Field({ nullable: true })
    segment?: string

    @Field({ nullable: true })
    productIds?: string
}

@ArgsType()
export class GetProductArgs extends CommonArgs {
    @Field({ nullable: true })
    id?: string

    @Field({ nullable: true })
    sku?: string

    @Field({ nullable: true })
    slug?: string

    @Field({ nullable: true })
    segment?: string
}

@ArgsType()
export class GetAttributeArgs {
    @Field()
    name: string
}

export class PbxQueryContext {
    args: CommonArgs = {}
    locale: string = 'en'
    country: string = 'US'
    currency: string = 'USD'
    segment?: string
    appUrl?: string

    constructor(context: PbxQueryContext) {
        this.args = context.args
        this.locale = context.locale || 'en'
        this.country = context.country || 'US'
        this.currency = context.currency || 'USD'
        this.segment = context.segment
        this.appUrl = context.appUrl
    }
}

export class PbxClient {
    url: string
    key: string

    constructor(url, key) {
        this.url = url
        this.key = key
    }

    async getProducts(context: PbxQueryContext): Promise<Product[]> {
        throw new Error('Subclasses of PbxClient must implement getProducts(context: PbxQueryContext)')
    }

    async getProduct(context: PbxQueryContext): Promise<Product> {
        throw new Error('Subclasses of PbxClient must implement getProduct(context: PbxQueryContext)')
    }

    async getCategories(context: PbxQueryContext): Promise<Category[]> {
        throw new Error('Subclasses of PbxClient must implement getCategories(context: PbxQueryContext)')
    }

    async getCategory(context: PbxQueryContext): Promise<Category> {
        throw new Error('Subclasses of PbxClient must implement getCategory(context: PbxQueryContext)')
    }
}

// import { getClient } from './client'
// export default { PbxClient, PbxQueryContext, getClient }
export default { PbxClient, PbxQueryContext }