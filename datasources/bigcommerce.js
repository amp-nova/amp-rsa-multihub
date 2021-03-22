"use strict";
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
var apiUrl = "https://api.bigcommerce.com";
var storeHash = "ivhpe1uqls";
var catalogApiUrl = apiUrl + "/stores/" + storeHash + "/v3/catalog";
var apiToken = "mgr4tatg4kainixjw8cgts10is2ka0y";
var axios_1 = require("axios");
var _ = require("lodash");
var mapImage = function (image) { return ({ url: image.url_standard }); };
var mapProduct = function (prod) { return ({
    id: prod.id,
    name: prod.name,
    shortDescription: prod.description,
    longDescription: prod.description,
    variants: [{
            id: prod.id,
            sku: prod.sku,
            prices: {
                list: prod.price
            },
            defaultImage: !_.isEmpty(prod.images) && mapImage(_.first(prod.images)),
            images: _.map(prod.images, mapImage)
        }]
}); };
var bcHeaders = {
    headers: {
        'X-Auth-Token': apiToken
    }
};
var makeCatalogAPIRequest = function (uri, mapper) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, axios_1.default("" + catalogApiUrl + uri, bcHeaders)];
            case 1:
                response = _e.sent();
                if (!!Array.isArray(response.data.data)) return [3 /*break*/, 3];
                return [4 /*yield*/, mapper(response.data.data)];
            case 2: return [2 /*return*/, _e.sent()];
            case 3:
                _b = (_a = Promise).all;
                _d = (_c = response.data.data).map;
                return [4 /*yield*/, mapper];
            case 4: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [_e.sent()])])];
            case 5: return [2 /*return*/, _e.sent()];
        }
    });
}); };
var populateCategory = function (cat) { return __awaiter(void 0, void 0, void 0, function () {
    var productResponse, categoryResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default(catalogApiUrl + "/products?categories:in=" + cat.id, bcHeaders)];
            case 1:
                productResponse = _a.sent();
                cat.products = _.map(productResponse.data.data, mapProduct);
                return [4 /*yield*/, axios_1.default(catalogApiUrl + "/categories?parent_id=" + cat.id, bcHeaders)];
            case 2:
                categoryResponse = _a.sent();
                cat.children = _.map(categoryResponse.data.data, function (cat) { return ({
                    id: cat.id,
                    name: cat.name
                }); });
                return [2 /*return*/, cat];
        }
    });
}); };
var BigCommerce = {
    products: {
        get: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeCatalogAPIRequest("/products?include=images", mapProduct)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        getById: function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeCatalogAPIRequest("/products/" + id + "?include=images", mapProduct)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        getBySku: function (sku) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = _).first;
                    return [4 /*yield*/, makeCatalogAPIRequest("/products?include=images&sku=" + sku, mapProduct)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        }); }); },
        getBySlug: function (slug) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        search: function (searchText) { return __awaiter(void 0, void 0, void 0, function () {
            var products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, makeCatalogAPIRequest("/products?include=images&name:like=%" + searchText + "%", mapProduct)];
                    case 1:
                        products = _a.sent();
                        return [4 /*yield*/, Promise.all(products.map(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                                var images;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, makeCatalogAPIRequest("/products/" + product.id + "/images", mapImage)];
                                        case 1:
                                            images = _a.sent();
                                            _.first(product.variants).images = images;
                                            _.first(product.variants).defaultImage = _.first(images);
                                            return [2 /*return*/, product];
                                    }
                                });
                            }); }))];
                    case 2:
                        products = _a.sent();
                        return [2 /*return*/, {
                                products: products
                            }];
                }
            });
        }); },
    },
    categories: {
        get: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeCatalogAPIRequest("/categories", populateCategory)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        getById: function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeCatalogAPIRequest("/categories/" + id, populateCategory)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); },
        getBySlug: function (slug) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }
    }
};
module.exports = BigCommerce;
//# sourceMappingURL=bigcommerce.js.map