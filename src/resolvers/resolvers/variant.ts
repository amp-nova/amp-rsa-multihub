import { Args, ArgsType, Resolver, Field, FieldResolver, Root } from 'type-graphql'
import { Variant, ProductImage } from '../../types'
import _ from 'lodash';

@ArgsType()
class GetAttributeArgs {
    @Field()
    name: string
}

@Resolver(Variant)
export class VariantResolver {
    @FieldResolver(returns => String)
    async attribute(@Root() variant: Variant, @Args() args: GetAttributeArgs) {
        return _.get(_.find(variant.attributes, att => att.name.toLowerCase() === args.name.toLowerCase()), 'value')
    }

    @FieldResolver(returns => ProductImage)
    async defaultImage(@Root() variant: Variant) {
        return _.first(variant.images)
    }
}

module.exports = { VariantResolver }