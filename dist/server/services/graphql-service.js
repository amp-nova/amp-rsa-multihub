"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGraphqlService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("@/server/util/logger"));
const resolvers_1 = __importDefault(require("@/server/resolvers"));
const { ApolloServer } = require('apollo-server-express');
const { buildSchema } = require('type-graphql');
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
async function startGraphqlService(app) {
    const server = new ApolloServer({
        schema: await buildSchema({ resolvers: resolvers_1.default }),
        playground: true,
        introspection: true,
        context: async ({ req }) => ({ commercehub: req.hub })
    });
    server.applyMiddleware({ app });
    app.post('/graphql', async (req, res, next) => {
        if (req.body && req.body.operationName !== 'IntrospectionQuery') {
            const objectLogger = await logger_1.default.getObjectLogger(req.correlationId);
            const requestStart = new Date();
            const xsend = res.send.bind(res);
            res.send = body => {
                let requestDuration = differenceInMilliseconds(new Date(), requestStart);
                let payload = JSON.parse(body);
                res.status(payload.errors ? 400 : 200);
                objectLogger.logGraphqlCall({
                    duration: requestDuration,
                    request: lodash_1.default.pick(req, ['method', 'statusMessage', 'statusCode', 'originalUrl', 'params', 'body', 'headers', 'url', 'query', 'length']),
                    response: {
                        statusCode: res.statusCode,
                        data: payload
                    }
                });
                xsend(body);
            };
        }
        next();
    });
}
exports.startGraphqlService = startGraphqlService;
