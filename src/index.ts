import "reflect-metadata";
import _ from 'lodash'
import camelcase from 'camelcase'
import url from 'whatwg-url'

const express = require('express')
const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs-extra')
const { nanoid } = require('nanoid')

const logger = require("./util/logger")
const commercehub = require('./hub/commerce')
require('./util/helpers')

const stringify = require('json-stringify-safe')
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds')

const config = require('./util/config')

const port = process.env.PORT || 6393

const headersForTag = tag => (val, key) => key.indexOf(`-${tag}-`) > -1
const getAmplienceConfigFromHeaders = headers => {
  const mapHeaders = tag => _.mapKeys(_.pickBy(headers, headersForTag(tag)), (val, key) => camelcase(key.replace(`x-arm-${tag}-`, '')))
  return {
    cmsContext: mapHeaders('cms'),
    userContext: mapHeaders('user'),
    appContext: {
      url: `http://localhost:3000`,
      ...mapHeaders('app')
    }
  }
}

let startServer = async () => {
  try {
    const server = new ApolloServer({
      schema: await buildSchema({ resolvers: require('./resolvers') }),
      playground: true,
      introspection: true,
      context: async ({ req }) => {
        return {
          commercehub: await commercehub({ 
            requestId: req.correlationId,
            backendKey: req.headers['x-arm-backend-key'], 
            logger: req.body.operationName !== 'IntrospectionQuery' && await logger.getObjectLogger(req.correlationId),
            ...getAmplienceConfigFromHeaders(req.headers)
          })          
        }
      }
    });
  
    const app = express()  
    app.use(bodyParser.json())
    app.use(require('./routes'))

    app.post('/graphql', async (req, res, next) => {
      if (req.body.operationName !== 'IntrospectionQuery') {
        let { appContext } = getAmplienceConfigFromHeaders(req.headers)

        const appUrl = url.parseURL(appContext.url)
        const bareHost = _.first(appUrl.host.split('.'))

        req.correlationId = `${bareHost}-${req.headers['x-arm-backend-key'].replace('/', '-')}-${req.body.operationName || `anonymousQuery`}-${nanoid(4)}`
        req.headers['x-arm-correlation-id'] = req.correlationId

        logger.info(`${req.headers['x-arm-host']}/logs/${req.correlationId}`)

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

    app.get('/logs/:requestId?', async (req, res, next) => {
      if (!req.params.requestId) {
        res.status(200).send(logger.getAppLogs())
      }
      else {
        res.status(200).send(await logger.readRequestObject(req.params.requestId))
      }
    })
    
    server.applyMiddleware({ app })
  
    await app.listen({ port })
    logger.info(`🚀 Server [ v${config.packageJson.version}/${config.git.branch} mode: ${config.app.mode || 'debug'} ] is ready at http://localhost:${port}${server.graphqlPath}`);
    return { server, app };
  } catch (error) {
    logger.error(error.stack)
    logger.error(JSON.stringify(error))    
  }
}
 
startServer()
export * from './schemas/types'
