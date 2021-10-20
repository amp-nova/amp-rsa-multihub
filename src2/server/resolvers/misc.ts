import { Ctx, Query, Resolver } from 'type-graphql'
import { Context } from '../../types'

@Resolver()
export class MiscResolver {
    @Query(returns => String)
    correlationId(@Ctx() ctx: Context) {
        return ctx.codec.config.context.requestId
    }

    // @Query(returns => String)
    // logUrl(@Ctx() ctx: Context) {
    //     return `${config.host}/logs/${ctx.codec.config.context.requestId}`
    // }
}

module.exports = { MiscResolver }