import { Ctx, Query, Resolver } from 'type-graphql'
import { Context } from '../../schemas/types'

@Resolver()
export class MiscResolver {
    @Query(returns => String)
    correlationId(@Ctx() ctx: Context) {
        return ctx.commercehub.config.context.requestId
    }

    @Query(returns => String)
    logUrl(@Ctx() ctx: Context) {
        return `http://localhost:6393/logs/${ctx.commercehub.config.context.requestId}`
    }
}

module.exports = { MiscResolver }