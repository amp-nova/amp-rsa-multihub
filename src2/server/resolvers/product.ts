import _ from 'lodash'
import { Args, Ctx, Query, Resolver } from 'type-graphql'
import { Product, ProductResults } from '@amp-nova/amp-rsa-types'
import { GetProductArgs, GetProductsArgs, Context } from '../../types'
import { CommerceCodec } from '../codec/codec'

@Resolver(Product)
export class ProductResolver {
    @Query(returns => ProductResults)
    async products(@Args() args: GetProductsArgs, @Ctx() ctx: Context) {
        return await (ctx.codec as CommerceCodec).getProducts(args)
    }

    @Query(returns => Product)
    async product(@Args() args: GetProductArgs, @Ctx() ctx: Context) {
        return await (ctx.codec as CommerceCodec).getProduct(args)
    }
}

module.exports = { ProductResolver }