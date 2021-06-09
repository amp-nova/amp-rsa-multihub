import _ from "lodash";
const express = require('express')

const logger = require("./util/logger")

const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');
const bodyParser = require('body-parser')

const fs = require('fs-extra')

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

  app.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' })
  })

  app.get('/meta', (req, res, next) => {    
    res.status(200).send({ 
      branch: process.env.arm_branch,
      build_date: process.env.arm_build_date,
      commit_hash: fs.existsSync('/etc/arm_commit_hash') && fs.readFileSync('/etc/arm_commit_hash', 'utf8').trim()
    })
  })

  app.use(bodyParser.json())

  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()