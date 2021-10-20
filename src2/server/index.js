"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger_1 = require("../../src/server/util/logger");
const log_service_1 = __importDefault(require("../../src/server/services/log-service"));
const translation_service_1 = __importDefault(require("../../src/server/services/translation-service"));
const graphql_service_1 = require("../../src/server/services/graphql-service");
const stringify = require('json-stringify-safe');
const config_1 = require("../../src/server/util/config");
const routes_1 = __importDefault(require("./routes"));
let startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`🚀 server [ v${process.env.npm_package_version}/${config_1.config.serviceName} mode: ${config_1.config.mode} ] is starting...`);
    try {
        const app = express();
        app.use(cors({ origin: true }));
        app.use(bodyParser.json());
        app.use(require('./util/correlation-id'));
        app.use(routes_1.default);
        app.use(translation_service_1.default);
        app.use(log_service_1.default);
        // configure graphql
        yield graphql_service_1.startGraphqlService(app);
        yield app.listen({ port: config_1.config.port });
        logger_1.logger.info(`🚀 server [ v${process.env.npm_package_version}/${config_1.config.serviceName} mode: ${config_1.config.mode} ] is ready at ${config_1.config.host}`);
        return { app };
    }
    catch (error) {
        logger_1.logger.error(error.stack);
        logger_1.logger.error(stringify(error));
    }
});
startServer();
