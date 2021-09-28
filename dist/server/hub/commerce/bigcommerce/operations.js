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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var lodash_1 = __importDefault(require("lodash"));
var URI = require('urijs');
var findCategory = require('@/server/util/helpers').findCategory;
var Operation = require('@/server/operation').Operation;
var mapImage = function (image) { return ({ url: image.url_standard }); };
var slugify = require('slugify');
var BigCommerceOperation = /** @class */ (function (_super) {
    __extends(BigCommerceOperation, _super);
    function BigCommerceOperation(config) {
        return _super.call(this, config) || this;
    }
    BigCommerceOperation.prototype.getBaseURL = function () {
        return this.backend.config.cred.apiUrl + "/stores/" + this.backend.config.cred.storeHash + "/v3/catalog";
    };
    BigCommerceOperation.prototype.getRequest = function (args) {
        var uri = new URI(this.getURL(args));
        if (args && args.limit && args.offset) {
            args.page = Math.floor(args.offset / args.limit + 1);
            // delete args.offset
        }
        var queryArgs = lodash_1.default.omit(args, [
            'locale',
            'offset',
            'language',
            'country',
            'currency',
            'category',
            'product',
            'body',
            'slug',
            'method',
            'productIds'
        ]);
        uri.addQuery(queryArgs);
        return uri.toString();
    };
    BigCommerceOperation.prototype.translateResponse = function (response, mapper) {
        if (mapper === void 0) { mapper = function (x) { return x; }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // a bc response will always have 'meta' and 'data'
                        // 'data' will sometimes be just an object, sometimes an array
                        response.data = Array.isArray(response.data) ? response.data : [response.data];
                        _e = {
                            meta: response.meta && response.meta.pagination && {
                                total: response.meta.pagination.total,
                                count: response.meta.pagination.count,
                                limit: response.meta.pagination.per_page,
                                offset: (response.meta.pagination.current_page - 1) * response.meta.pagination.per_page
                            }
                        };
                        _b = (_a = Promise).all;
                        _d = (_c = response.data).map;
                        return [4 /*yield*/, mapper];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [_f.sent()])])];
                    case 2: return [2 /*return*/, (_e.results = _f.sent(),
                            _e)];
                }
            });
        });
    };
    BigCommerceOperation.prototype.getHeaders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        'X-Auth-Token': this.backend.config.cred.apiToken,
                        'Content-Type': "application/json"
                    }];
            });
        });
    };
    return BigCommerceOperation;
}(Operation));
// category operation
var BigCommerceCategoryOperation = /** @class */ (function (_super) {
    __extends(BigCommerceCategoryOperation, _super);
    function BigCommerceCategoryOperation(config) {
        return _super.call(this, config) || this;
    }
    BigCommerceCategoryOperation.prototype.getRequestPath = function (args) {
        return "categories/tree";
    };
    BigCommerceCategoryOperation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.post.call(this, __assign(__assign({}, args), { body: Promise.resolve().then(function () { return __importStar(require(args.category)); }) }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BigCommerceCategoryOperation.prototype.import = function (input) {
        return {
            name: input.name,
            parent_id: input.parentId
        };
    };
    BigCommerceCategoryOperation.prototype.export = function (args) {
        return this.mapCategory(null);
    };
    BigCommerceCategoryOperation.prototype.mapCategory = function (parentSlug) {
        var self = this;
        return function (cat) {
            var catSlug = slugify(cat.name, { lower: true });
            var slug = parentSlug ? parentSlug + "-" + catSlug : catSlug;
            return {
                id: "" + cat.id,
                name: cat.name,
                slug: slug,
                parentId: "" + cat.parent_id,
                children: lodash_1.default.map(cat.children, lodash_1.default.bind(self.mapCategory(slug), self))
            };
        };
    };
    return BigCommerceCategoryOperation;
}(BigCommerceOperation));
// end category operations
// product operation
var BigCommerceProductOperation = /** @class */ (function (_super) {
    __extends(BigCommerceProductOperation, _super);
    function BigCommerceProductOperation(config) {
        return _super.call(this, config) || this;
    }
    BigCommerceProductOperation.prototype.getRequestPath = function (args) {
        return args.id ? "products/" + args.id : "products";
    };
    BigCommerceProductOperation.prototype.get = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.get.call(this, __assign(__assign({}, args), { 'id:in': args.productIds, include: 'images,variants' }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BigCommerceProductOperation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.post.call(this, __assign(__assign({}, args), { body: args.product && this.import(args.product) }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BigCommerceProductOperation.prototype.export = function (args) {
        var self = this;
        return function (prod) { return (__assign(__assign({}, prod), { shortDescription: prod.description, longDescription: prod.description, slug: slugify(prod.name, { lower: true, remove: /\"/g }), variants: lodash_1.default.map(prod.variants, function (variant) { return (__assign(__assign({}, variant), { prices: {
                    list: self.formatMoneyString(variant.price || prod.price),
                    sale: self.formatMoneyString(variant.sale_price || prod.price)
                }, attributes: variant.option_values.map(function (opt) { return ({
                    name: opt.option_display_name.toLowerCase(),
                    value: opt.label
                }); }), images: variant.image_url ? [{ url: variant.image_url }] : lodash_1.default.map(prod.images, mapImage) })); }), productType: 'product' })); };
    };
    BigCommerceProductOperation.prototype.import = function (input) {
        return {
            // required BC fields
            name: input.name,
            type: 'physical',
            weight: 0,
            sku: input.sku,
            price: lodash_1.default.first(input.variants).prices.list,
            categories: input.categories,
            variants: lodash_1.default.map(input.variants, function (variant) { return ({
                sku: variant.sku,
                price: variant.prices.list,
                // image_url: variant.defaultImage.url,
                option_values: lodash_1.default.map(lodash_1.default.filter(variant.attributes, function (_a) {
                    var name = _a.name, value = _a.value;
                    return value;
                }), function (attribute) { return ({
                    option_display_name: attribute.name,
                    label: attribute.value
                }); })
            }); }),
            images: lodash_1.default.flatMap(input.images, function (x) { return ({ image_url: x.url, is_thumbnail: true }); }),
        };
    };
    BigCommerceProductOperation.prototype.postProcessor = function (args) {
        var _this = this;
        return function (products) { return __awaiter(_this, void 0, void 0, function () {
            var operation, categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operation = new BigCommerceCategoryOperation(this.backend);
                        return [4 /*yield*/, operation.get({})];
                    case 1:
                        categories = (_a.sent()).getResults();
                        return [2 /*return*/, lodash_1.default.map(products, function (prod) { return (__assign(__assign({}, prod), { categories: lodash_1.default.map(prod.categories, function (id) { return findCategory(categories, { id: "" + id }); }) })); })];
                }
            });
        }); };
    };
    return BigCommerceProductOperation;
}(BigCommerceOperation));
// end product operations
module.exports = {
    productOperation: function (backend) { return new BigCommerceProductOperation(backend); },
    categoryOperation: function (backend) { return new BigCommerceCategoryOperation(backend); },
};
