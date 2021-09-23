"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger_1 = require("@/server/util/logger");
const log_service_1 = __importDefault(require("@/server/services/log-service"));
const translation_service_1 = __importDefault(require("@/server/services/translation-service"));
const graphql_service_1 = require("@/server/services/graphql-service");
const config_1 = require("@/server/util/config");
const routes_1 = __importDefault(require("@/server/routes"));
let startServer = async () => {
    logger_1.logger.info(`🚀 server [ v${process.env.npm_package_version}/${config_1.config.serviceName} mode: ${config_1.config.mode} ] is starting...`);
    try {
        const app = express();
        app.use(cors({ origin: true }));
        app.use(bodyParser.json());
        app.use(routes_1.default);
        app.use(require('@/server/util/correlation-id'));
        app.use(translation_service_1.default);
        app.use(log_service_1.default);
        // configure graphql
        await graphql_service_1.startGraphqlService(app);
        await app.listen({ port: config_1.config.port });
        logger_1.logger.info(`🚀 server [ v${process.env.npm_package_version}/${config_1.config.serviceName} mode: ${config_1.config.mode} ] is ready at ${config_1.config.host}`);
        return { app };
    }
    catch (error) {
        logger_1.logger.error(error.stack);
        logger_1.logger.error(JSON.stringify(error));
    }
};
startServer();
