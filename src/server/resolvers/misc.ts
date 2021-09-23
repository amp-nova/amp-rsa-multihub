import { Ctx, Query, Resolver } from 'type-graphql'
import { Context } from '../../types'
const config = require('../util/config')

@Resolver()
export class MiscResolver {
    @Query(returns => String)
    correlationId(@Ctx() ctx: Context) {
        return ctx.commercehub.config.context.requestId
    }

    @Query(returns => String)
    logUrl(@Ctx() ctx: Context) {
        return `${config.host}/logs/${ctx.commercehub.config.context.requestId}`
    }
}

module.exports = { MiscResolver }