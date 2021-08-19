import "reflect-metadata";
import _ from 'lodash'

const express = require('express')
const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql')
const bodyParser = require('body-parser')

const logger = require("./util/logger")
const commercehub = require('./hub/commerce')
require('./util/helpers')

const port = process.env.PORT || 6393

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
          commercehub: await commercehub({ backendKey: req.headers['x-commerce-backend-key'] }),
          backendKey: req.headers['x-commerce-backend-key']
        }
      }
    });
  
    const app = express()  
    app.use(bodyParser.json())
    app.use(require('./routes'))
    
    server.applyMiddleware({ app })
  
    await app.listen({ port })
    logger.info(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    return { server, app };
  } catch (error) {
    logger.error(JSON.stringify(error))    
  }
}

module.exports = startServer()