"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbxLogger = exports.logger = void 0;
var winston = require('winston');
var path = require('path');
var Transport = require('winston-transport');
// import fs from 'fs-extra';
var appLogs = [];
var AppTransport = /** @class */ (function (_super) {
    __extends(AppTransport, _super);
    function AppTransport(opts) {
        return _super.call(this, opts) || this;
    }
    AppTransport.prototype.log = function (info, callback) {
        appLogs.push({
            message: info.message,
            level: info.level
        });
        callback();
    };
    return AppTransport;
}(Transport));
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
exports.logger.getLogDir = function () { return path.resolve(__dirname + "/../../../logs"); };
exports.logger.getLogPath = function (requestId) { return path.resolve(exports.logger.getLogDir() + "/" + requestId + ".json"); };
var cachedLogs = {};
var getLogByRequestId = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var cached, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cachedLogs[requestId];
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, exports.logger.readLogFile(requestId)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                cached = _a || {
                    graphql: {},
                    backend: []
                };
                persistLogObject(requestId, cached);
                return [2 /*return*/, cached];
        }
    });
}); };
var persistLogObject = function (requestId, object) {
    cachedLogs[requestId] = object;
    exports.logger.writeLogFile(requestId, object);
};
exports.logger.getObjectLogger = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var obj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getLogByRequestId(requestId)];
            case 1:
                obj = _a.sent();
                return [2 /*return*/, {
                        logBackendCall: function (object) {
                            obj.backend.push(object);
                            persistLogObject(requestId, obj);
                        },
                        logGraphqlCall: function (object) {
                            obj.graphql = object;
                            persistLogObject(requestId, obj);
                        }
                    }];
        }
    });
}); };
if (typeof window === 'undefined') {
    var fs_1 = require('fs-extra');
    exports.logger.readLogFile = function (requestId) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = fs_1.existsSync(exports.logger.getLogPath(requestId));
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.readJson(exports.logger.getLogPath(requestId), { encoding: 'utf8' })];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2: return [2 /*return*/, _a];
        }
    }); }); };
    exports.logger.writeLogFile = function (requestId, obj) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.writeJson(exports.logger.getLogPath(requestId), obj)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); }); };
    exports.logger.readRequestObject = function (requestId) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cachedLogs[requestId];
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, exports.logger.readLogFile(requestId)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2: return [2 /*return*/, _a];
        }
    }); }); };
    exports.logger.getAppLogs = function () { return appLogs; };
}
var PbxLogger = /** @class */ (function () {
    function PbxLogger() {
    }
    PbxLogger.prototype.info = function (text) { };
    PbxLogger.prototype.debug = function (text) { };
    PbxLogger.prototype.error = function (text) { };
    PbxLogger.prototype.getObjectLogger = function (x) { };
    PbxLogger.prototype.readRequestObject = function (x) { };
    PbxLogger.prototype.getAppLogs = function () { };
    return PbxLogger;
}());
exports.PbxLogger = PbxLogger;
exports.default = exports.logger;
