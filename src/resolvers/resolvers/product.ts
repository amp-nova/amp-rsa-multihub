import { Args, ArgsType, Ctx, Query, Resolver, Field, FieldResolver, Root } from 'type-graphql'
import { Product, Variant, ProductResults, ProductImage } from '../../types'
import { CommonArgs, ListArgs, Context } from './common'
import _ from 'lodash'

@ArgsType()
class GetProductsArgs extends ListArgs {
    @Field({ nullable: true })
    keyword: string
}

@ArgsType()
class GetProductArgs extends CommonArgs {
    @Field({ nullable: true })
    id: string

    @Field({ nullable: true })
    sku: string

    @Field({ nullable: true })
    slug: string
}

@Resolver(Product)
export class ProductResolver {
    @Query(returns => ProductResults)
    async products(@Args() args: GetProductsArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getProducts(args)
    }

    @Query(returns => Product)
    async product(@Args() args: GetProductArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getProduct(args)
    }
}

module.exports = { ProductResolver }