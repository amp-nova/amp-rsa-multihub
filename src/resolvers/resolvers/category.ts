import { Args, ArgsType, Ctx, Query, Resolver, Field, FieldResolver, Root } from 'type-graphql'
import { CommonArgs, Context } from './common'
import _ from 'lodash'
import { bool } from 'aws-sdk/clients/signer'

import { Category } from 'amp-rsa-gql'

@ArgsType()
class GetCategoryArgs extends CommonArgs {
    @Field({ nullable: true })
    id: string

    @Field({ nullable: true })
    slug: string
}

@ArgsType()
class GetCategoryProductArgs extends CommonArgs {
    @Field({ nullable: true })
    full: bool

    @Field({ nullable: true })
    customerSegment: string
}

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