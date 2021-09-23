"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const whatwg_url_1 = __importDefault(require("whatwg-url"));
const router = require('express').Router();
const camelcase = require('camelcase');
const { nanoid } = require('nanoid');
const hub_1 = require("@/server/hub");
const config_1 = require("@/server/util/config");
const logger_1 = __importDefault(require("@/server/util/logger"));
const headersForTag = tag => (val, key) => key.indexOf(`-${tag}-`) > -1;
const getAmplienceConfigFromHeaders = headers => {
    const mapHeaders = tag => lodash_1.default.mapKeys(lodash_1.default.pickBy(headers, headersForTag(tag)), (val, key) => camelcase(key.replace(`x-arm-${tag}-`, '')));
    return {
        cmsContext: mapHeaders('cms'),
        userContext: mapHeaders('user'),
        appContext: {
            url: `http://localhost:3000`,
            ...mapHeaders('app')
        }
    };
};
router.use(async (req, res, next) => {
    var _a;
    if ((req.path.indexOf('graphql') > -1 && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.operationName) !== 'IntrospectionQuery') || req.path.indexOf('api/') > -1) {
        const backendKey = req.headers['x-pbx-backend-key'] || req.headers['x-arm-backend-key'];
        if (backendKey) {
            let { appContext } = getAmplienceConfigFromHeaders(req.headers);
            const appUrl = whatwg_url_1.default.parseURL(appContext.url);
            const bareHost = lodash_1.default.first(appUrl.host.split('.'));
            const graphqlOrigin = whatwg_url_1.default.serializeURLOrigin(whatwg_url_1.default.parseURL(config_1.config.host));
            const tag = req.path.indexOf('graphql') > -1 ? req.body.operationName || `anonymousQuery` : req.path.split('/').pop();
            req.correlationId = `${bareHost}-${backendKey.replace('/', '-')}-${tag}-${nanoid(4)}`;
            req.headers['x-arm-correlation-id'] = req.correlationId;
            logger_1.default.info(`${graphqlOrigin}/logs/${req.correlationId}`);
            req.hub = await hub_1.getClient({
                backendKey,
                requestId: req.correlationId,
                logger: await logger_1.default.getObjectLogger(req.correlationId),
                ...getAmplienceConfigFromHeaders(req.headers)
            });
        }
    }
    next();
});
module.exports = router;
