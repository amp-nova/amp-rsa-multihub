"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const nconf = require('nconf');
const port = process.env.PORT || '6393';
const envName = process.env.COPILOT_ENVIRONMENT_NAME || 'local';
const appName = process.env.COPILOT_APPLICATION_NAME || 'nova';
const serviceName = process.env.COPILOT_SERVICE_NAME || 'pbx';
const host = envName === 'local' ? `http://localhost:${port}` : `https://${serviceName}.${envName}.${appName}.${process.env.pbx_domain}`;
exports.config = {
    serviceName,
    mode: envName,
    host,
    port
};
exports.default = exports.config;
