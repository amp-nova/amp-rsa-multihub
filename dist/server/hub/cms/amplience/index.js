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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplienceBackend = void 0;
var __1 = require("..");
var dc_management_sdk_js_1 = require("dc-management-sdk-js");
var translation_client_1 = __importDefault(require("./translation-client"));
var logger_1 = __importDefault(require("@/server/util/logger"));
var axios = require('axios');
var fetch = require('node-fetch');
var jsonpath = require('jsonpath');
var updateStatus = function (contentItem, state) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        logger_1.default.info("[ cms ] updateStatus on content item [ " + contentItem.id + " ] to [ " + state + " ]");
        return [2 /*return*/, contentItem.updateLinkedResource('edit-workflow', {}, { state: state, version: contentItem.version }, dc_management_sdk_js_1.ContentItem)];
    });
}); };
var doTranslateContentItem = function (contentItem, locale, config) { return __awaiter(void 0, void 0, void 0, function () {
    var contentTypeConfig, _a, language, __;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                contentTypeConfig = config.contentTypes.find(function (x) { return x.schema === contentItem.body._meta.schema; });
                if (!contentTypeConfig) {
                    logger_1.default.info("skipping " + contentItem.id + ", content type not configured for translation");
                    return [2 /*return*/, contentItem];
                }
                _a = locale.split('-'), language = _a[0], __ = _a[1];
                return [4 /*yield*/, Promise.all(config.contentTypes.map(function (contentType) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all(contentType.fieldAllowList.map(function (field) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a, _b, _c;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    _b = (_a = jsonpath).value;
                                                    _c = [contentItem.body, field];
                                                    return [4 /*yield*/, translation_client_1.default(jsonpath.value(contentItem.body, field), language)];
                                                case 1:
                                                    _b.apply(_a, _c.concat([_d.sent()]));
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _b.sent();
                return [2 /*return*/, contentItem.related.update(contentItem)];
        }
    });
}); };
var AmplienceBackend = /** @class */ (function (_super) {
    __extends(AmplienceBackend, _super);
    function AmplienceBackend(backend) {
        var _this = this;
        console.log(backend);
        _this = _super.call(this, backend) || this;
        _this.dc = new dc_management_sdk_js_1.DynamicContent({ client_id: _this.config.cred.client_id, client_secret: _this.config.cred.client_secret });
        return _this;
    }
    AmplienceBackend.prototype.getContentItem = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getContentItems");
                        return [4 /*yield*/, this.dc.contentItems.get(payload.payload.id)];
                    case 1:
                        item = _a.sent();
                        console.log("content items: " + JSON.stringify(item));
                        return [2 /*return*/, item
                            // let contentItem = await axios.get(`https://${this.config.cred.id}.cdn.content.amplience.net/content/id/${payload.payload.id}`, {
                            //     headers: { 'Authorization': await this.authenticate() }
                            // })
                            // console.log(`contentItem!`)
                            // console.log(contentItem)
                            // return payload
                        ];
                }
            });
        });
    };
    AmplienceBackend.prototype.getTranslationConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getTranslationConfig");
                        return [4 /*yield*/, fetch("https://" + this.config.cred.id + ".cdn.content.amplience.net/content/key/config/translation?depth=all&format=inlined")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, (_a.sent()).content];
                }
            });
        });
    };
    AmplienceBackend.prototype.translateContentItem = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var translationConfig, contentItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTranslationConfig()];
                    case 1:
                        translationConfig = _a.sent();
                        return [4 /*yield*/, this.getContentItem(payload)];
                    case 2:
                        contentItem = _a.sent();
                        if (!(contentItem.workflow.state !== translationConfig.workflowStates.inProgress)) return [3 /*break*/, 6];
                        return [4 /*yield*/, updateStatus(contentItem, translationConfig.workflowStates.inProgress)];
                    case 3:
                        contentItem = _a.sent();
                        return [4 /*yield*/, doTranslateContentItem(contentItem, contentItem.locale, translationConfig)];
                    case 4:
                        contentItem = _a.sent();
                        return [4 /*yield*/, updateStatus(contentItem, translationConfig.workflowStates.complete)];
                    case 5:
                        contentItem = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, contentItem];
                }
            });
        });
    };
    AmplienceBackend.prototype.getSource = function () {
        return this.config.cred.type + "/" + this.config.cred.id;
    };
    return AmplienceBackend;
}(__1.CMSBackend));
exports.AmplienceBackend = AmplienceBackend;
module.exports = AmplienceBackend;
