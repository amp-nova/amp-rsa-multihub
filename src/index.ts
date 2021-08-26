import "reflect-metadata";
import _ from 'lodash'
import camelcase from 'camelcase'

const express = require('express')
const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql')
const bodyParser = require('body-parser')

const logger = require("./util/logger")
const commercehub = require('./hub/commerce')
require('./util/helpers')

const config = require('./util/config')

const port = process.env.PORT || 6393

const headersForTag = tag => (val, key) => {
  return key.indexOf(`-${tag}-`) > -1
}

const getAmplienceConfigFromHeaders = headers => {
  return {
    cmsContext: _.mapKeys(_.pickBy(headers, headersForTag('cms')), (val, key) => camelcase(key.replace('x-amplience-cms-', ''))),
    userContext: _.mapKeys(_.pickBy(headers, headersForTag('user')), (val, key) => camelcase(key.replace('x-amplience-user-', '')))
  }
}

let startServer = async () => {
  try {
    const schema = await buildSchema({
      resolvers: require('./resolvers')
    })
  
    const server = new ApolloServer({
      schema,
      playground: true,
      introspection: true,
      context: async ({ req }) => {
        return {
          commercehub: await commercehub({ backendKey: req.headers['x-commerce-backend-key'], ...getAmplienceConfigFromHeaders(req.headers) }),
          backendKey: req.headers['x-commerce-backend-key']          
        }
      }
    });
  
    const app = express()  
    app.use(bodyParser.json())
    app.use(require('./routes'))
    
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
