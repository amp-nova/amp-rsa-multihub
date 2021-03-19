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
var _this = this;
var _ = require("lodash");
var CT = require("ctvault");
var mapVariant = function (variant) { return ({
    id: variant.id,
    sku: variant.sku,
    prices: {
        list: variant.prices[0].value.centAmount / 100
    },
    images: _.map(variant.images, function (image) { return ({
        url: image.url
    }); }),
    defaultImage: { url: _.first(variant.images).url }
}); };
var mapCategory = function (ct) { return function (category) {
    var cat = category.obj || category;
    var defaultLanguage = _.first(ct.projectMetadata.languages);
    console.log(JSON.stringify({
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage]
    }));
    return {
        id: category.id,
        name: cat.name[defaultLanguage],
        slug: cat.slug[defaultLanguage]
    };
}; };
var mapProduct = function (ct) { return function (prod) {
    var defaultLanguage = _.first(ct.projectMetadata.languages);
    var allVariants = _.concat(prod.variants, [prod.masterVariant]);
    return {
        id: prod.id,
        name: prod.name[defaultLanguage],
        slug: prod.slug[defaultLanguage],
        categories: _.map(prod.categories, mapCategory(ct)),
        variants: _.map(allVariants, mapVariant)
    };
}; };
var populateCategory = function (ct) { return function (category) { return __awaiter(_this, void 0, void 0, function () {
    var cat, defaultLanguage, products, childCategories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cat = category.obj || category;
                defaultLanguage = _.first(ct.projectMetadata.languages);
                return [4 /*yield*/, ct.productProjectionsSearch.all({ expand: ['categories[*]'], filter: ["categories.id:\"" + category.id + "\""] })
                    // get the child categories
                ];
            case 1:
                products = _a.sent();
                return [4 /*yield*/, ct.categories.all({ where: ["parent(id=\"" + category.id + "\")"] })];
            case 2:
                childCategories = _a.sent();
                return [2 /*return*/, {
                        id: category.id,
                        name: cat.name[defaultLanguage],
                        slug: cat.slug[defaultLanguage],
                        products: _.map(products, mapProduct(ct)),
                        children: _.map(childCategories, mapCategory(ct))
                    }];
        }
    });
}); }; };
var getCTClient = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CT.getClient('daves-test-project')];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
module.exports = {
    products: {
        get: function () { return __awaiter(_this, void 0, void 0, function () {
            var ct, products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _a.sent();
                        console.log(Object.keys(ct));
                        return [4 /*yield*/, ct.productProjections.all({ expand: ['categories[*]'] })];
                    case 2:
                        products = _a.sent();
                        return [2 /*return*/, _.map(products, mapProduct(ct))];
                }
            });
        }); },
        getById: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var ct, product, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _c.sent();
                        _b = (_a = _).first;
                        return [4 /*yield*/, ct.productProjections.all({ expand: ['categories[*]'], where: ["id=\"" + id + "\""] })];
                    case 2:
                        product = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, product && mapProduct(ct)(product)];
                }
            });
        }); },
        getBySku: function (sku) { return __awaiter(_this, void 0, void 0, function () {
            var ct, product, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _c.sent();
                        _b = (_a = _).first;
                        return [4 /*yield*/, ct.productProjections.all({ expand: ['categories[*]'], where: ["masterVariant(sku=\"" + sku + "\")"] })];
                    case 2:
                        product = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, product && mapProduct(ct)(product)];
                }
            });
        }); },
        getBySlug: function (slug) { return __awaiter(_this, void 0, void 0, function () {
            var ct, defaultLanguage, product, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _c.sent();
                        defaultLanguage = _.first(ct.projectMetadata.languages);
                        _b = (_a = _).first;
                        return [4 /*yield*/, ct.productProjections.all({ expand: ['categories[*]'], where: ["slug(" + defaultLanguage + "=\"" + slug + "\")"] })];
                    case 2:
                        product = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, product && mapProduct(ct)(product)];
                }
            });
        }); }
    },
    categories: {
        get: function () { return __awaiter(_this, void 0, void 0, function () {
            var ct, categories, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _e.sent();
                        return [4 /*yield*/, ct.categories.all()
                            // return _.map(categories, mapCategory(ct))
                        ];
                    case 2:
                        categories = _e.sent();
                        _b = (_a = Promise).all;
                        _d = (_c = categories).map;
                        return [4 /*yield*/, populateCategory(ct)];
                    case 3: return [4 /*yield*/, _b.apply(_a, [_d.apply(_c, [_e.sent()])])];
                    case 4: 
                    // return _.map(categories, mapCategory(ct))
                    return [2 /*return*/, _e.sent()];
                }
            });
        }); },
        getById: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var ct, category, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _d.sent();
                        _b = (_a = _).first;
                        return [4 /*yield*/, ct.categories.get({ where: ["id=\"" + id + "\""] })];
                    case 2:
                        category = _b.apply(_a, [_d.sent()]);
                        _c = category;
                        if (!_c) return [3 /*break*/, 4];
                        return [4 /*yield*/, populateCategory(ct)(category)];
                    case 3:
                        _c = (_d.sent());
                        _d.label = 4;
                    case 4: return [2 /*return*/, _c];
                }
            });
        }); },
        getBySlug: function (slug) { return __awaiter(_this, void 0, void 0, function () {
            var ct, defaultLanguage, category, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, getCTClient()];
                    case 1:
                        ct = _d.sent();
                        defaultLanguage = _.first(ct.projectMetadata.languages);
                        _b = (_a = _).first;
                        return [4 /*yield*/, ct.categories.get({ where: ["slug(" + defaultLanguage + "=\"" + slug + "\")"] })];
                    case 2:
                        category = _b.apply(_a, [_d.sent()]);
                        _c = category;
                        if (!_c) return [3 /*break*/, 4];
                        return [4 /*yield*/, populateCategory(ct)(category)];
                    case 3:
                        _c = (_d.sent());
                        _d.label = 4;
                    case 4: return [2 /*return*/, _c];
                }
            });
        }); }
    }
};
//# sourceMappingURL=commercetools.js.map