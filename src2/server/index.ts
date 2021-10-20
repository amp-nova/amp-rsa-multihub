import "reflect-metadata";

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

import { logger } from '../../src/server/util/logger'
import logService from '../../src/server/services/log-service'
import translationService from '../../src/server/services/translation-service'
import { startGraphqlService } from '../../src/server/services/graphql-service'
const stringify = require('json-stringify-safe')

import { config } from "../../src/server/util/config";
import routes from './routes'

let startServer = async () => {
  logger.info(`🚀 server [ v${process.env.npm_package_version}/${config.serviceName} mode: ${config.mode} ] is starting...`);
  try {
    const app = express()
    app.use(cors({ origin: true }));
    app.use(bodyParser.json())
    
    app.use(require('./util/correlation-id'))
    
    app.use(routes)
    app.use(translationService)
    app.use(logService)
    
    // configure graphql
    await startGraphqlService(app)

    await app.listen({ port: config.port })
    logger.info(`🚀 server [ v${process.env.npm_package_version}/${config.serviceName} mode: ${config.mode} ] is ready at ${config.host}`);
    return { app };
  } catch (error) {
    logger.error(error.stack)
    logger.error(stringify(error))
  }
}

startServer()