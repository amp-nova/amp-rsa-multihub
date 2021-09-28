"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var nconf = require('nconf');
var port = process.env.PORT || '6393';
var envName = process.env.COPILOT_ENVIRONMENT_NAME || 'local';
var appName = process.env.COPILOT_APPLICATION_NAME || 'nova';
var serviceName = process.env.COPILOT_SERVICE_NAME || 'pbx';
var host = envName === 'local' ? "http://localhost:" + port : "https://" + serviceName + "." + envName + "." + appName + "." + process.env.pbx_domain;
exports.config = {
    serviceName: serviceName,
    mode: envName,
    host: host,
    port: port
};
exports.default = exports.config;
