"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./util/config');
const logger = require("./util/logger");
require('./util/helpers');
let startServer = async () => {
    try {
        const app = express();
        app.use(bodyParser.json());
        app.use(require('./routes'));
        app.use(require('./util/correlation-id'));
        app.use(require('./services/translation-service'));
        app.use(require('./services/log-service'));
        // configure graphql
        const graphqlService = await require('./services/graphql-service')(app);
        await app.listen({ port: config.app.port });
        logger.info(`🚀 Server [ v${config.packageJson.version}/${config.git.branch} mode: ${config.app.mode} ] is ready at ${config.app.host}${graphqlService.graphqlPath}`);
        return { app };
    }
    catch (error) {
        logger.error(error.stack);
        logger.error(JSON.stringify(error));
    }
};
startServer();
__exportStar(require("./schemas/types"), exports);
