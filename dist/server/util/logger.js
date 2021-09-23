"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbxLogger = exports.logger = void 0;
const winston = require('winston');
const path = require('path');
const Transport = require('winston-transport');
// import fs from 'fs-extra';
const fs = require('fs-extra');
const appLogs = [];
class AppTransport extends Transport {
    constructor(opts) {
        super(opts);
    }
    log(info, callback) {
        appLogs.push({
            message: info.message,
            level: info.level
        });
        callback();
    }
}
exports.logger = winston.createLogger({
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
    exports.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
exports.logger.getLogDir = () => path.resolve(`${__dirname}/../../logs`);
exports.logger.getLogPath = requestId => path.resolve(`${exports.logger.getLogDir()}/${requestId}.json`);
const cachedLogs = {};
const getLogByRequestId = async (requestId) => {
    const cached = cachedLogs[requestId] || await exports.logger.readLogFile(requestId) || {
        graphql: {},
        backend: []
    };
    persistLogObject(requestId, cached);
    return cached;
};
const persistLogObject = (requestId, object) => {
    cachedLogs[requestId] = object;
    exports.logger.writeLogFile(requestId, object);
};
exports.logger.getObjectLogger = async (requestId) => {
    let obj = await getLogByRequestId(requestId);
    return {
        logBackendCall: object => {
            obj.backend.push(object);
            persistLogObject(requestId, obj);
        },
        logGraphqlCall: object => {
            obj.graphql = object;
            persistLogObject(requestId, obj);
        }
    };
};
exports.logger.readLogFile = async (requestId) => fs.existsSync(exports.logger.getLogPath(requestId)) && await fs.readJson(exports.logger.getLogPath(requestId), { encoding: 'utf8' });
exports.logger.writeLogFile = async (requestId, obj) => await fs.writeJson(exports.logger.getLogPath(requestId), obj);
exports.logger.readRequestObject = async (requestId) => cachedLogs[requestId] || await exports.logger.readLogFile(requestId);
exports.logger.getAppLogs = () => appLogs;
class PbxLogger {
    info(text) { }
    debug(text) { }
    error(text) { }
    getObjectLogger(x) { }
    readRequestObject(x) { }
    getAppLogs() { }
}
exports.PbxLogger = PbxLogger;
exports.default = exports.logger;
