import _ from "lodash";
const express = require('express')

const logger = require("./util/logger")

const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');

let startServer = async() => {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    playground: true, 
    introspection: true,
    context: async ({ req }) => {
      return {
        backendKey: req.headers['x-commerce-backend-key']
      }
    }
  });

  const app = express()

  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()