import _ from "lodash";
const express = require('express')

const logger = require("./util/logger")

const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');

// const schema = makeExecutableSchema({
//   resolverValidationOptions: { requireResolversForResolveType: false },
// });

let config = require('./util/config')
const CT = require('ctvault')
let ampvault = require('ampvault')

let startServer = async() => {
  // set up the credential vault
  let vault = await ampvault(config.ampvault)
  _.each(config.commerceBackends, vault.addCredential)
  // end setup
  
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    playground: true, 
    introspection: true,
    context: async ({ req }) => ({
      graphqlLocale: req.headers['x-graphql-locale'] || 'en',
      backendClient: await vault.getClient(req.headers['x-commerce-backend-key'])
    })
  });

  const app = express()
  // app.use((req, res, next) => {
  //   req.client = 

  //   // if (req.method === 'POST' && !_.includes(availableCommerceBackends, req.headers['x-commerce-backend'])) {
  //   //   return res.status(500).send({ message: `Header X-Commerce-Backend must be one of: [ ${availableCommerceBackends.join(', ')} ]` })
  //   // }
  //   next()
  // })

  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()