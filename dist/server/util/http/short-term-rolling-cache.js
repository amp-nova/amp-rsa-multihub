"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@/server/util/logger");
const axios_1 = __importDefault(require("axios"));
let cache = {};
let timer = (url, seconds = 10) => setTimeout(() => {
    logger_1.logger.debug(`decached [${url}]`);
    delete cache[url];
}, seconds * 1000);
module.exports = seconds => async (request) => {
    switch (request.method) {
        case 'get':
            if (cache[request.url]) {
                // logger.info(`[  cache ] ${request.url}`)
                clearTimeout(cache[request.url].timeout);
                cache[request.url].timeout = timer(request.url);
                return {
                    data: cache[request.url].response
                };
            }
            else {
                // logger.info(`[ ${request.method.padStart(6, ' ')} ] ${request.url}`)
                let x = await axios_1.default(request);
                cache[request.url] = {
                    response: x.data,
                    timeout: timer(request.url, seconds)
                };
                return x;
            }
        default:
            // logger.info(`[ ${request.method.padStart(6, ' ')} ] ${request.url}`)
            return await axios_1.default(request);
    }
};
