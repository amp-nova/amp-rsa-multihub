import _ from "lodash";
const express = require('express')

const logger = require("./util/logger")

const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');
const bodyParser = require('body-parser')

const config = require('./util/config')
const { S3, ListBucketsCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3(config.hub)
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra')

let startServer = async() => {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    playground: true, 
    introspection: true,
    context: async ({ req }) => {
      return {
        backendKey: req.headers['x-commerce-backend-key'],
        logger: req.logger
      }
    }
  });

  const app = express()

  // let data = await s3.send(new ListBucketsCommand({}))
  // console.log(`data: ${JSON.stringify(data)}`)

  const uploadParams = {
    Bucket: "amp-rsa-multihub-logs",
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: "log-1",
    // Content of the new object.
    Body: JSON.stringify({
      "foo": "baz"
    })
  };

  // let uploaded = await s3.send(new PutObjectCommand(uploadParams))
  // console.log(`uploaded: ${JSON.stringify(uploaded)}`)

  // app.use((req, res, next) => {
  //   console.log(`req ${req.path}`)
  //   next()
  // })

  app.get('/check', (req, res, next) => {
    res.status(200).send({ status: 'ok' })
  })

  app.use(bodyParser.json())

  let requestLogger = id => ({
    log: (key, body) => {
      fs.mkdirSync(`${logDir}/${id}`, { recursive: true })

      let index = 0
      let filename = `${key}_${index}.txt`
      let path = `${logDir}/${id}/${filename}`
      while (fs.existsSync(path)) {
        index = index + 1
        filename = `${key}_${index}.txt`
        path = `${logDir}/${id}/${filename}`
      }

      fs.writeFileSync(`${path}`, body)
    }
  })

  var logDir = "/opt/logs/multihub"
  app.post('*', (req, res, next) => {
    if (req.body.operationName !== 'IntrospectionQuery') {
      req.logger = requestLogger(uuidv4())
      req.logger.log('graphql_query', req.body.query)

      let _send = res.send
      res.send = function(...args) {
        req.logger.log('graphql_response', JSON.stringify(JSON.parse(arguments[0]), null, 4))
        _send.apply(res, args)
      }
    }
    next()
  })

  // app.use(function (req, res, next) {
  //   req.on("end", function () {
  //       console.log('on request end');
  //   });
  //   next();
  // });

  server.applyMiddleware({ app })

  await new Promise(resolve => app.listen({ port: process.env.PORT || 3000 }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}${server.graphqlPath}`);
  return { server, app };
}

startServer()