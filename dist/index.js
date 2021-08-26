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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const lodash_1 = __importDefault(require("lodash"));
const camelcase_1 = __importDefault(require("camelcase"));
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql');
const bodyParser = require('body-parser');
const logger = require("./util/logger");
const commercehub = require('./hub/commerce');
require('./util/helpers');
const config = require('./util/config');
const port = process.env.PORT || 6393;
const headersForTag = tag => (val, key) => {
    return key.indexOf(`-${tag}-`) > -1;
};
const getAmplienceConfigFromHeaders = headers => {
    return {
        cmsContext: lodash_1.default.mapKeys(lodash_1.default.pickBy(headers, headersForTag('cms')), (val, key) => camelcase_1.default(key.replace('x-amplience-cms-', ''))),
        userContext: lodash_1.default.mapKeys(lodash_1.default.pickBy(headers, headersForTag('user')), (val, key) => camelcase_1.default(key.replace('x-amplience-user-', '')))
    };
};
let startServer = async () => {
    try {
        const schema = await buildSchema({
            resolvers: require('./resolvers')
        });
        const server = new ApolloServer({
            schema,
            playground: true,
            introspection: true,
            context: async ({ req }) => {
                return {
                    commercehub: await commercehub({ backendKey: req.headers['x-commerce-backend-key'], ...getAmplienceConfigFromHeaders(req.headers) }),
                    backendKey: req.headers['x-commerce-backend-key']
                };
            }
        });
        const app = express();
        app.use(bodyParser.json());
        app.use(require('./routes'));
        server.applyMiddleware({ app });
        await config.init();
        await app.listen({ port });
        logger.info(`🚀 Server [ v${config.packageJson.version}/${config.cli.git} ] is ready at http://localhost:${port}${server.graphqlPath}`);
        return { server, app };
    }
    catch (error) {
        logger.error(error.stack);
        logger.error(JSON.stringify(error));
    }
};
startServer();
__exportStar(require("./schemas/types"), exports);
