import _ from 'lodash'
import { Args, Ctx, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import { Category, Product } from '@amp-nova/amp-rsa-types'
import { GetCategoryArgs, GetCategoryProductArgs, Context } from '../../types'
import { CommerceCodec } from '../codec/codec'

@Resolver(Category)
export class CategoryResolver {
    @Query(x => Category)
    async category(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await (ctx.codec as CommerceCodec).getCategory(args)
    }

    @Query(x => [Category])
    async categoryHierarchy(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await (ctx.codec as CommerceCodec).getCategory({})
    }

    @FieldResolver(x => [Product], { nullable: true })
    async products(@Root() parent: Category, @Args() args: GetCategoryProductArgs, @Ctx() ctx: Context) {
        return await (ctx.codec as CommerceCodec).getProductsForCategory(parent, args)
    }
}

module.exports = { CategoryResolver }