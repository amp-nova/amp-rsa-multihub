const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql')
const _ = require('lodash')
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds')

const logger = require("../util/logger")

module.exports = async app => {
    const server = new ApolloServer({
        schema: await buildSchema({ resolvers: require('../resolvers') }),
        playground: true,
        introspection: true,
        context: async ({ req }) => ({ commercehub: req.hub })
    });

    app.post('/graphql', async (req, res, next) => {
        if (req.body && req.body.operationName !== 'IntrospectionQuery') {
            const objectLogger = await logger.getObjectLogger(req.correlationId)

            const requestStart = new Date()
            const xsend = res.send.bind(res);
            res.send = body => {
                let requestDuration = differenceInMilliseconds(new Date(), requestStart)

                let payload = JSON.parse(body)
                res.status(payload.errors ? 400 : 200)

                objectLogger.logGraphqlCall({
                    duration: requestDuration,
                    request: _.pick(req, ['method', 'statusMessage', 'statusCode', 'originalUrl', 'params', 'body', 'headers', 'url', 'query', 'length']),
                    response: {
                        statusCode: res.statusCode,
                        data: payload
                    }
                })
                xsend(body)
            }
        }
        next()
    })

    server.applyMiddleware({ app })
    return server
}