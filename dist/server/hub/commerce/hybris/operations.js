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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var urijs_1 = __importDefault(require("urijs"));
var lodash_1 = __importDefault(require("lodash"));
var atob_1 = __importDefault(require("atob"));
var Operation = require('@/server/operation').Operation;
var slugify = require('slugify');
var stripHTML = function (text) { return text.replace(/(<([^>]+)>)/gi, ""); };
var HybrisOperation = /** @class */ (function (_super) {
    __extends(HybrisOperation, _super);
    function HybrisOperation(config) {
        return _super.call(this, config) || this;
    }
    HybrisOperation.prototype.getRequest = function (args) {
        var uri = new urijs_1.default(this.getURL(args));
        args.pageSize = args.limit;
        args.currentPage = args.offset;
        uri.addQuery(args);
        return uri.toString();
    };
    HybrisOperation.prototype.getBaseURL = function () {
        return this.backend.config.cred.server + "/occ/v2/" + this.backend.config.cred.baseSiteId;
    };
    HybrisOperation.prototype.getOauthURL = function () {
        return this.backend.config.cred.server + "/authorizationserver/oauth/token?\n            client_id=" + this.backend.config.cred.clientId + "&\n            client_secret=" + this.backend.config.cred.clientSecret + "&\n            grant_type=password&\n            username=" + this.backend.config.cred.username + "&\n            password=" + this.backend.config.cred.password;
    };
    HybrisOperation.prototype.translateResponse = function (response, mapper) {
        if (mapper === void 0) { mapper = function (x) { return x; }; }
        return __awaiter(this, void 0, void 0, function () {
            var results, _a, _b, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        results = (response.code || response.id) ? [response] : (response.categories || response.products);
                        results = Array.isArray(results) ? results : [results];
                        _e = {
                            meta: response.pagination && {
                                total: response.pagination.totalResults,
                                count: results.length,
                                limit: response.pagination.pageSize,
                                offset: (response.pagination.currentPage - 1) * response.pagination.pageSize
                            }
                        };
                        _b = (_a = Promise).all;
                        _d = (_c = results).map;
                        return [4 /*yield*/, mapper];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [_f.sent()])])];
                    case 2: return [2 /*return*/, (_e.results = _f.sent(),
                            _e)];
                }
            });
        });
    };
    return HybrisOperation;
}(Operation));
// category operation
var HybrisCategoryOperation = /** @class */ (function (_super) {
    __extends(HybrisCategoryOperation, _super);
    function HybrisCategoryOperation(config) {
        return _super.call(this, config) || this;
    }
    HybrisCategoryOperation.prototype.getRequestPath = function (args) {
        return "catalogs/" + this.backend.config.cred.catalogId + "/" + this.backend.config.cred.catalogVersion + "/categories/" + (args.id || "1");
    };
    HybrisCategoryOperation.prototype.export = function (args) {
        var _this = this;
        return function (category) {
            return {
                id: category.id || category.code,
                name: category.name || category.code,
                slug: slugify(category.name || category.code, { lower: true }),
                children: lodash_1.default.map(category.subcategories, lodash_1.default.bind(_this.export(args), _this))
            };
        };
    };
    HybrisCategoryOperation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = __assign(__assign({}, args), { body: args.category && this.import(args.category) });
                        return [4 /*yield*/, _super.prototype.post.call(this, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HybrisCategoryOperation;
}(HybrisOperation));
// end category operations
var imageContainer = function (cred) {
    var images = [];
    return {
        addImage: function (image) {
            var _a = image.url.split('='), __ = _a[0], blob = _a[1];
            var decoded = atob_1.default(blob);
            var _b = decoded.split('|'), sysdir = _b[0], ___ = _b[1], size = _b[2], imageType = _b[3], imagePath = _b[4], ____ = _b[5];
            image.size = parseInt(size);
            images.push(image);
        },
        toUrl: function () { return ({
            url: "" + cred.server + lodash_1.default.first(lodash_1.default.reverse(lodash_1.default.sortBy(images, 'size'))).url,
            large: "" + cred.server + lodash_1.default.first(lodash_1.default.reverse(lodash_1.default.sortBy(images, 'size'))).url,
            thumb: "" + cred.server + lodash_1.default.first(lodash_1.default.sortBy(images, 'size')).url
        }); }
    };
};
// product operation
var HybrisProductOperation = /** @class */ (function (_super) {
    __extends(HybrisProductOperation, _super);
    function HybrisProductOperation(config) {
        return _super.call(this, config) || this;
    }
    HybrisProductOperation.prototype.getRequestPath = function (args) {
        if (args.id || args.sku) {
            return "products/" + (args.id || args.sku);
        }
        else if (args.keyword) {
            return "products/search?query=" + args.keyword;
        }
        else if (args.categoryId) {
            return "categories/" + args.categoryId + "/products";
        }
        else {
            return "products/search";
        }
    };
    // export: native format to common format
    HybrisProductOperation.prototype.export = function (args) {
        var _this = this;
        var categoryOperation = new HybrisCategoryOperation(this.backend.config.cred);
        return function (prod) {
            var primaryImage = null;
            var gallery = {};
            if (!lodash_1.default.isEmpty(prod.images)) {
                primaryImage = imageContainer(_this.backend.config.cred);
                lodash_1.default.each(prod.images, function (image) {
                    var galleryImage = gallery[image.galleryIndex] || imageContainer(_this.backend.config.cred);
                    var source = image.imageType === 'PRIMARY' ? primaryImage : galleryImage;
                    source.addImage(image);
                    if (image.imageType === 'GALLERY') {
                        gallery[image.galleryIndex] = source;
                    }
                });
            }
            if (lodash_1.default.isEmpty(gallery) && primaryImage) {
                gallery.primary = primaryImage;
            }
            return __assign(__assign({}, prod), { name: stripHTML(prod.name), id: prod.code, slug: slugify(stripHTML(prod.name), { lower: true }), shortDescription: prod.summary && stripHTML(prod.summary), longDescription: prod.description && stripHTML(prod.description), categories: lodash_1.default.map(prod.categories, function (cat) { return categoryOperation.export(args)(cat); }), variants: [{
                        sku: prod.code,
                        prices: { list: prod.price && prod.price.formattedValue, sale: prod.price && prod.price.formattedValue },
                        images: lodash_1.default.map(lodash_1.default.values(gallery), function (g) { return g.toUrl(); }),
                        defaultImage: primaryImage && primaryImage.toUrl()
                    }], productType: 'product' });
        };
    };
    HybrisProductOperation.prototype.get = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = __assign(__assign({}, args), { fields: 'FULL' });
                        if (!args.productIds) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(args.productIds.split(',').map(function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, _super.prototype.get.call(this, __assign(__assign({}, args), { id: id }))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, {
                                meta: {
                                    total: results.length,
                                    count: results.length,
                                    limit: 0,
                                    offset: 0
                                },
                                results: results
                            }];
                    case 2: return [4 /*yield*/, _super.prototype.get.call(this, args)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HybrisProductOperation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = __assign(__assign({}, args), { body: args.product && this.import(args.product) });
                        return [4 /*yield*/, _super.prototype.post.call(this, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HybrisProductOperation;
}(HybrisOperation));
// end product operations
module.exports = {
    productOperation: function (config) { return new HybrisProductOperation(config); },
    categoryOperation: function (config) { return new HybrisCategoryOperation(config); },
};
