import _ from 'lodash';
import { Args, Resolver, FieldResolver, Root } from 'type-graphql'
import { Variant, ProductImage, GetAttributeArgs } from 'amp-rsa-gql'

@Resolver(Variant)
export class VariantResolver {
    @FieldResolver(returns => String, { nullable: true })
    async attribute(@Root() variant: Variant, @Args() args: GetAttributeArgs) {
        return _.get(_.find(variant.attributes, att => att.name.toLowerCase() === args.name.toLowerCase()), 'value')
    }

    @FieldResolver(returns => ProductImage)
    async defaultImage(@Root() variant: Variant) {
        return _.first(variant.images)
    }
}

module.exports = { VariantResolver }