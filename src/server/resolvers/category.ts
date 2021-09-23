import _ from 'lodash'
import { Args, Ctx, Query, Resolver, FieldResolver, Root } from 'type-graphql'
import { Category, GetCategoryArgs, GetCategoryProductArgs, Context } from '../../types'

@Resolver(Category)
export class CategoryResolver {
    @Query(returns => Category)
    async category(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getCategory(args)
    }

    @Query(returns => [Category])
    async categoryHierarchy(@Args() args: GetCategoryArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getCategoryHierarchy(args)
    }

    @FieldResolver()
    async products(@Root() parent: Category, @Args() args: GetCategoryProductArgs, @Ctx() ctx: Context) {
        return await ctx.commercehub.getProductsForCategory(parent, args)
    }
}

module.exports = { CategoryResolver }