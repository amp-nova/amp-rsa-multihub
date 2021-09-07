import "reflect-metadata";

const express = require('express')
const bodyParser = require('body-parser')

const config = require('./util/config')
const logger = require("./util/logger")

require('./util/helpers')
let startServer = async () => {
  try {
    const app = express()
    app.use(bodyParser.json())
    app.use(require('./routes'))

    app.use(require('./util/correlation-id'))
    app.use(require('./services/translation-service'))
    app.use(require('./services/log-service'))

    // configure graphql
    const graphqlService = await require('./services/graphql-service')(app)

    await app.listen({ port: config.app.port })
    logger.info(`🚀 Server [ v${config.packageJson.version}/${config.git.branch} mode: ${config.app.mode} ] is ready at ${config.app.host}${graphqlService.graphqlPath}`);
    return { app };
  } catch (error) {
    logger.error(error.stack)
    logger.error(JSON.stringify(error))
  }
}

startServer()
export * from './schemas/types'
