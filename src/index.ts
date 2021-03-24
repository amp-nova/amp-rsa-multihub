import _ from "lodash";
const express = require('express')
const { readFileSync } = require('fs')
const yaml = require('js-yaml');

const logger = require("./util/logger")

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../config/settings.yaml`).toString();

// Converting from YAML to JSON
global.config = yaml.load(settingsYAML)
logger.info('settings.yaml loaded');

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
      commerceBackend: req.headers['x-commerce-backend']
    })
  });

  const app = express()
  app.use((req, res, next) => {
    if (!_.includes(availableCommerceBackends, req.headers['x-commerce-backend'])) {
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