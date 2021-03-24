const express = require('express')
const { readFileSync } = require('fs')
const yaml = require('js-yaml');

console.log(__dirname)

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../config/settings.yaml`).toString();

// Converting from YAML to JSON
global.config = yaml.load(settingsYAML)
console.log('Global settings loaded');

const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');

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

  // console.log(Object.keys(server))
  // await server.start()

  const app = express()
  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()

// server.listen(process.env.PORT || 3000).then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });