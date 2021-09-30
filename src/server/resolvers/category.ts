import _ from 'lodash'
import { Args, Ctx, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import { Category, Product } from 'amp-rsa-types'
import { GetCategoryArgs, GetCategoryProductArgs, Context } from '../../types'

@Resolver(Category)
export class CategoryResolver {
    @Query(x => Category)
    async category(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getCategory(args)
    }

    @Query(x => [Category])
    async categoryHierarchy(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getCategoryHierarchy(args)
    }

    @FieldResolver(x => [Product], { nullable: true })
    async products(@Root() parent: Category, @Args() args: GetCategoryProductArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getProductsForCategory(parent, args)
    }
}

module.exports = { CategoryResolver }