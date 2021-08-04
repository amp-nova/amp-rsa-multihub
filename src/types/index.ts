import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Prices {
    @Field()
    sale: string

    @Field()
    list: string
}

@ObjectType()
export class ProductImage {
    @Field()
    url: string
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
    shortDescription: string

    @Field({ nullable: true })
    longDescription: string

    @Field(type => [Category])
    categories: Category[]

    @Field(type => [Variant])
    variants: Variant[]
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
    defaultImage: ProductImage

    @Field(type => [ProductImage])
    images: ProductImage[]

    @Field(type => [Attribute])
    attributes: Attribute[]
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