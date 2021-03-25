import _ from "lodash";
const express = require('express')

const logger = require("./util/logger")

const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { availableCommerceBackends, resolvers } = require('./resolvers/resolvers');

let startServer = async() => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    playground: true, 
    introspection: true,
    context: ({ req }) => ({
      commerceBackend: req.headers['x-commerce-backend'],
      graphqlLocale: req.headers['x-graphql-locale'] || 'en',
      commercetoolsProject: req.headers['x-commercetools-project']
    })
  });

  const app = express()
  app.use((req, res, next) => {
    if (req.method === 'POST' && !_.includes(availableCommerceBackends, req.headers['x-commerce-backend'])) {
      return res.status(500).send({ message: `Header X-Commerce-Backend must be one of: [ ${availableCommerceBackends.join(', ')} ]` })
    }
    next()
  })

  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()