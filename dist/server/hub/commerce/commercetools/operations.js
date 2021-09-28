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
// 3rd party libs
var _ = require('lodash');
var URI = require('urijs');
var axios = require('axios');
var currency = require('currency.js');
var stringify = require('json-stringify-safe');
var Operation = require('@/server/operation').Operation;
var mapImage = function (image) { return image && ({ url: image.url }); };
var CommerceToolsOperation = /** @class */ (function (_super) {
    __extends(CommerceToolsOperation, _super);
    function CommerceToolsOperation(backend) {
        var _this = _super.call(this, backend) || this;
        _this.accessToken = null;
        return _this;
    }
    CommerceToolsOperation.prototype.getBaseURL = function () {
        return this.backend.config.cred.api_url + "/" + this.backend.config.cred.project;
    };
    CommerceToolsOperation.prototype.getRequest = function (args) {
        var uri = new URI(this.getURL(args));
        var query = __assign({ limit: args.limit, offset: args.offset, where: args.where, filter: args.filter }, args);
        // add any filters based on the args
        uri.addQuery(query);
        return uri.toString();
    };
    CommerceToolsOperation.prototype.localize = function (text) {
        if (text.label) {
            text = text.label;
        }
        if (typeof text === 'string') {
            return text;
        }
        return text[this.backend.config.context.language] || text['en'] || text[Object.keys(text)[0]];
    };
    CommerceToolsOperation.prototype.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.accessToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios.post(this.backend.config.cred.oauth_url + "/oauth/token?grant_type=client_credentials&scope=" + _.first(_.split(this.backend.config.cred.scope, ' ')), {}, {
                                auth: {
                                    username: this.backend.config.cred.client_id,
                                    password: this.backend.config.cred.client_secret
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        this.accessToken = response.data.token_type + " " + response.data.access_token;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.accessToken];
                }
            });
        });
    };
    CommerceToolsOperation.prototype.translateResponse = function (data, mapper) {
        if (mapper === void 0) { mapper = (function (x) { return x; }); }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _e = {
                            meta: data.limit && {
                                limit: data.limit,
                                count: data.count,
                                offset: data.offset,
                                total: data.total
                            }
                        };
                        _b = (_a = Promise).all;
                        _d = (_c = (data.results || data)).map;
                        return [4 /*yield*/, mapper];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [_f.sent()])])];
                    case 2: 
                    // a commercetools response will be either a single object, or an array in 'results'
                    // if it is an array, limit, count, total, and offset are provided on the object
                    return [2 /*return*/, (_e.results = _f.sent(),
                            _e)];
                }
            });
        });
    };
    CommerceToolsOperation.prototype.getHeaders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.authenticate()];
                    case 1: return [2 /*return*/, (_a.authorization = _b.sent(), _a)];
                }
            });
        });
    };
    return CommerceToolsOperation;
}(Operation));
// category operation
var CommerceToolsCategoryOperation = /** @class */ (function (_super) {
    __extends(CommerceToolsCategoryOperation, _super);
    function CommerceToolsCategoryOperation(config) {
        return _super.call(this, config) || this;
    }
    CommerceToolsCategoryOperation.prototype.export = function (args) {
        var self = this;
        return function (category) {
            return __assign(__assign({}, category), { name: self.localize(category.name), slug: self.localize(category.slug) });
        };
    };
    CommerceToolsCategoryOperation.prototype.getRequestPath = function (args) {
        return "categories";
    };
    CommerceToolsCategoryOperation.prototype.get = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.get.call(this, __assign(__assign({}, args), { limit: 500, where: args.slug && ["slug(" + (this.backend.config.context.language || 'en') + "=\"" + args.slug + "\") or slug(en=\"" + args.slug + "\")"] ||
                                args.id && ["id=\"" + args.id + "\""] }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CommerceToolsCategoryOperation;
}(CommerceToolsOperation));
// end category operations
// cart discount operation
var CommerceToolsCartDiscountOperation = /** @class */ (function (_super) {
    __extends(CommerceToolsCartDiscountOperation, _super);
    function CommerceToolsCartDiscountOperation(config) {
        return _super.call(this, config) || this;
    }
    CommerceToolsCartDiscountOperation.prototype.getRequestPath = function (args) {
        return "cart-discounts";
    };
    return CommerceToolsCartDiscountOperation;
}(CommerceToolsOperation));
// end cart discount operations
// product operation
var CommerceToolsProductOperation = /** @class */ (function (_super) {
    __extends(CommerceToolsProductOperation, _super);
    function CommerceToolsProductOperation(config) {
        return _super.call(this, config) || this;
    }
    CommerceToolsProductOperation.prototype.getRequestPath = function (args) {
        return (args.keyword || args.filter) ? "product-projections/search" : "product-projections";
    };
    CommerceToolsProductOperation.prototype.get = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _super.prototype.get.call(this, __assign(__assign({}, args), (_a = { expand: ['categories[*]'], priceCountry: this.backend.config.context.country, priceCurrency: this.backend.config.context.currency }, _a["text." + this.backend.config.context.language] = args.keyword, _a.filter = args.productIds && ["id:" + _.map(args.productIds.split(','), function (x) { return "\"" + x + "\""; }).join(',')], _a.where = args.id && ["id=\"" + args.id + "\""] ||
                            args.slug && ["slug(" + this.backend.config.context.language + "=\"" + args.slug + "\") or slug(en=\"" + args.slug + "\")"] ||
                            args.sku && ["variants(sku=\"" + args.sku + "\")"], _a)))];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    CommerceToolsProductOperation.prototype.post = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = __assign(__assign({}, args), { body: Promise.resolve().then(function () { return __importStar(require(args.product)); }) });
                        return [4 /*yield*/, _super.prototype.post.call(this, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommerceToolsProductOperation.prototype.export = function (args) {
        var self = this;
        return function (product) {
            return __assign(__assign({}, product), { name: this.localize(product.name), slug: this.localize(product.slug), longDescription: product.metaDescription && this.localize(product.metaDescription), variants: _.map(_.concat(product.variants, [product.masterVariant]), function (variant) {
                    return __assign(__assign({}, variant), { sku: variant.sku || product.key, prices: {
                            list: self.formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100),
                            sale: self.formatMoneyString(_.get(variant.scopedPrice || _.first(variant.prices), 'value.centAmount') / 100)
                        }, images: _.map(variant.images, mapImage), attributes: _.map(variant.attributes, function (att) { return ({ name: att.name, value: self.localize(att.value) }); }) });
                }), categories: _.map(product.categories, function (cat) {
                    var category = cat.obj || cat;
                    return __assign(__assign({}, category), { name: self.localize(category.name), slug: self.localize(category.slug) });
                }), productType: product.productType.id });
        };
    };
    CommerceToolsProductOperation.prototype.postProcessor = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, function (products) {
                        return __awaiter(this, void 0, void 0, function () {
                            var segment, discountOperation, cartDiscounts, applicableDiscounts_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        segment = self.backend.config.context.segment;
                                        if (!(!_.isEmpty(segment) && segment !== 'null' && segment !== 'undefined')) return [3 /*break*/, 2];
                                        discountOperation = new CommerceToolsCartDiscountOperation(self.backend);
                                        return [4 /*yield*/, discountOperation.get({})];
                                    case 1:
                                        cartDiscounts = (_a.sent()).getResults();
                                        applicableDiscounts_1 = _.filter(cartDiscounts, function (cd) { return cd.cartPredicate === "customer.customerGroup.key = \"" + segment.toUpperCase() + "\""; });
                                        return [2 /*return*/, _.map(products, function (product) {
                                                return __assign(__assign({}, product), { variants: _.map(product.variants, function (variant) {
                                                        var sale = currency(variant.prices.list).value;
                                                        _.each(applicableDiscounts_1, function (discount) {
                                                            if (discount.target.type === 'lineItems') {
                                                                var _a = discount.target.predicate.split(" = "), predicateKey = _a[0], predicateValue = _a[1];
                                                                if (discount.target.predicate === '1 = 1' || (predicateKey === 'productType.id' && "\"" + product.productType + "\"" === predicateValue)) {
                                                                    if (discount.value.type === 'relative') {
                                                                        // permyriad is pct off * 10000
                                                                        sale = sale * (1 - discount.value.permyriad / 10000);
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        variant.prices.sale = currency(sale).format();
                                                        return variant;
                                                    }) });
                                            })];
                                    case 2: return [2 /*return*/, products];
                                }
                            });
                        });
                    }];
            });
        });
    };
    return CommerceToolsProductOperation;
}(CommerceToolsOperation));
module.exports = {
    productOperation: function (backend) { return new CommerceToolsProductOperation(backend); },
    categoryOperation: function (backend) { return new CommerceToolsCategoryOperation(backend); },
};
