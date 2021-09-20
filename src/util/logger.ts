const winston = require('winston')
const path = require('path')
const Transport = require('winston-transport');

import _ from 'lodash'
import fs from 'fs-extra';

const appLogs = []

class AppTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  log(info, callback) {
    appLogs.push({
      message: info.message,
      level: info.level
    })
    callback()
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new AppTransport({}),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

logger.getLogDir = () => path.resolve(`${__dirname}/../../logs`)
logger.getLogPath = requestId => path.resolve(`${logger.getLogDir()}/${requestId}.json`)

const cachedLogs = {}
const getLogByRequestId = async requestId => {
  const cached = cachedLogs[requestId] || await logger.readLogFile(requestId) || {
    graphql: {},
    backend: []
  }
  persistLogObject(requestId, cached)
  return cached
}

const persistLogObject = (requestId, object) => {
  cachedLogs[requestId] = object
  logger.writeLogFile(requestId, object)
}

logger.getObjectLogger = async requestId => {
  let obj = await getLogByRequestId(requestId)
  return {
    logBackendCall: object => {
      obj.backend.push(object)
      persistLogObject(requestId, obj)
    },

    logGraphqlCall: object => {
      obj.graphql = object
      persistLogObject(requestId, obj)
    }    
  }
}

logger.readLogFile = async requestId => fs.existsSync(logger.getLogPath(requestId)) && await fs.readJson(logger.getLogPath(requestId), { encoding: 'utf8' })
logger.writeLogFile = async (requestId, obj) => await fs.writeJson(logger.getLogPath(requestId), obj)
logger.readRequestObject = async requestId => cachedLogs[requestId] || await logger.readLogFile(requestId)
logger.getAppLogs = () => appLogs

module.exports = logger
export default logger