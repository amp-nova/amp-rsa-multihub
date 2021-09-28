"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Operation = void 0;
var _ = require('lodash');
var https = require('https');
var request = require('./util/http/short-term-rolling-cache')(30);
// const request = require('../../util/http/no-cache')
var nanoid = require('nanoid').nanoid;
var Operation = /** @class */ (function () {
    function Operation(backend) {
        this.backend = backend;
    }
    Operation.prototype.import = function (native) {
        return native;
    };
    Operation.prototype.export = function (args) {
        return function (native) { return native; };
    };
    Operation.prototype.get = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doRequest(__assign({ method: 'get' }, args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Operation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doRequest(__assign({ method: 'post' }, args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Operation.prototype.put = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doRequest(__assign({ method: 'put' }, args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Operation.prototype.delete = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doRequest(__assign({ method: 'delete' }, args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Operation.prototype.getURL = function (args) {
        return this.getBaseURL() + "/" + this.getRequestPath(args);
    };
    Operation.prototype.getBaseURL = function () {
        throw new Error("getBaseURL must be defined in an operation subclass");
    };
    Operation.prototype.getRequestPath = function (args) {
        return "";
    };
    Operation.prototype.getRequest = function (args) {
        var url = this.getURL(args);
        return url.toString();
    };
    Operation.prototype.postProcessor = function (args) {
        return function (native) { return native; };
    };
    Operation.prototype.doRequest = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var url, httpsAgent, requestParams, backendRequestId, response, x_1, px, _a, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.getRequest(args);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        httpsAgent = new https.Agent({ rejectUnauthorized: false });
                        _b = { url: url, method: args.method };
                        return [4 /*yield*/, this.getHeaders()];
                    case 2:
                        requestParams = (_b.headers = _c.sent(), _b.data = args.body, _b);
                        backendRequestId = this.backend.getSource() + "." + nanoid(10);
                        return [4 /*yield*/, request(__assign(__assign({}, requestParams), { httpsAgent: httpsAgent }))
                            // log the response object
                            // mask the auth token first if there is one
                        ];
                    case 3:
                        response = _c.sent();
                        // log the response object
                        // mask the auth token first if there is one
                        if (requestParams.headers['authorization']) {
                            requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + "********";
                        }
                        this.backend.config.context.logger.logBackendCall({
                            id: backendRequestId,
                            request: requestParams,
                            response: response.data
                        });
                        return [4 /*yield*/, this.translateResponse(response.data, _.bind(this.export(args), this))];
                    case 4:
                        x_1 = _c.sent();
                        x_1.getResults = function () { return x_1.results; };
                        if (!x_1) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.postProcessor(args)];
                    case 5:
                        px = _c.sent();
                        if (!px) return [3 /*break*/, 7];
                        _a = x_1;
                        return [4 /*yield*/, px(x_1.results)];
                    case 6:
                        _a.results = _c.sent();
                        _c.label = 7;
                    case 7:
                        if (args.id || args.slug || args.method === 'post') {
                            return [2 /*return*/, _.first(x_1.results)];
                        }
                        else {
                            return [2 /*return*/, x_1];
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        if (args.method === 'delete') {
                            return [2 /*return*/, args.id];
                        }
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, {}];
                }
            });
        });
    };
    Operation.prototype.translateResponse = function (data, arg1) {
        throw new Error("Method not implemented.");
    };
    Operation.prototype.getHeaders = function () {
        return {};
    };
    Operation.prototype.formatMoneyString = function (money) {
        console.log(this.backend.config.context);
        return new Intl.NumberFormat(this.backend.config.context.locale, {
            style: 'currency',
            currency: this.backend.config.context.currency
        }).format(money);
    };
    return Operation;
}());
exports.Operation = Operation;
module.exports = { Operation: Operation };
