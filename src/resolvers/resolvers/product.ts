import _ from 'lodash'
import { Args, Ctx, Query, Resolver } from 'type-graphql'
import { GetProductArgs, GetProductsArgs, Product, ProductResults, Context } from 'amp-rsa-gql'

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