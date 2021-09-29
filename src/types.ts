import { ArgsType, Field, ObjectType } from "type-graphql";

import { 
    Prices, ProductImage, ResultsMeta, ProductResults, CategoryResults, Identifiable, 
    CommerceObject, Product, Attribute, Variant, Category, SearchResult 
} from 'amp-rsa-types'

const stringField = {
    nullable: Field(type => String, { nullable: true }),
    nonNullable: Field(type => String, { nullable: false })
}

const numberField = {
    nullable: Field(type => Number, { nullable: true }),
    nonNullable: Field(type => Number, { nullable: false })
}

// Prices
ObjectType({})(Prices)
stringField.nullable(Prices.prototype, 'sale')
stringField.nullable(Prices.prototype, 'list')

// ProductImage
ObjectType({})(ProductImage)
stringField.nonNullable(ProductImage.prototype, 'url')
stringField.nullable(ProductImage.prototype, 'large')
stringField.nullable(ProductImage.prototype, 'thumb')

// ResultsMeta
ObjectType({})(ResultsMeta)
numberField.nonNullable(ResultsMeta.prototype, 'limit')
numberField.nonNullable(ResultsMeta.prototype, 'offset')
numberField.nonNullable(ResultsMeta.prototype, 'count')
numberField.nonNullable(ResultsMeta.prototype, 'total')

// ProductResults
ObjectType({})(ProductResults)
Field(type => ResultsMeta)(ProductResults.prototype, 'meta')
Field(type => [Product])(ProductResults.prototype, 'results')

// CategoryResults
ObjectType({})(CategoryResults)
Field(type => ResultsMeta)(CategoryResults.prototype, 'meta')
Field(type => [Category])(CategoryResults.prototype, 'results')

// Identifiable
ObjectType({})(Identifiable)
stringField.nonNullable(Identifiable.prototype, 'id')

// CommerceObject
ObjectType({})(CommerceObject)
stringField.nonNullable(CommerceObject.prototype, 'slug')
stringField.nonNullable(CommerceObject.prototype, 'name')
stringField.nonNullable(CommerceObject.prototype, 'raw')

// Product
ObjectType({})(Product)
stringField.nonNullable(Product.prototype, 'productType')
stringField.nullable(Product.prototype, 'shortDescription')
stringField.nullable(Product.prototype, 'longDescription')
Field(type => [Category])(Product.prototype, 'categories')
Field(type => [Variant])(Product.prototype, 'variants')

// Attribute
ObjectType({})(Attribute)
stringField.nonNullable(Attribute.prototype, 'name')
stringField.nonNullable(Attribute.prototype, 'value')

// Variant
ObjectType({})(Variant)
stringField.nonNullable(Variant.prototype, 'sku')
stringField.nullable(Variant.prototype, 'color')
stringField.nullable(Variant.prototype, 'size')
stringField.nullable(Variant.prototype, 'articleNumberMax')
Field(type => Prices)(Variant.prototype, 'prices')
Field(type => ProductImage, { nullable: true })(Variant.prototype, 'defaultImage')
Field(type => [ProductImage])(Variant.prototype, 'images')
Field(type => [Attribute])(Variant.prototype, 'attributes')

// Category
ObjectType({})(Category)
Field(type => [Category])(Category.prototype, 'children')
Field(type => [Product])(Category.prototype, 'products')

// SearchResult
ObjectType({})(SearchResult)
Field(type => [Product])(Category.prototype, 'products')

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

export class QueryContext {
    args:       CommonArgs
    locale:     string
    language:   string
    country:    string
    currency:   string
    segment:    string
    appUrl:     string

    constructor(args?: CommonArgs, locale?: string, language?: string, country?: string, currency?: string, segment?: string, appUrl?: string) {
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