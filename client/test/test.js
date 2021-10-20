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
require("reflect-metadata");
var _ = require('lodash');
var chalk = require('chalk');
var nconf = require('nconf');
var axios = require('axios');
var types_1 = require("../../src/types");
var __1 = require("..");
var commerceCodecKeyPrefixes = ['bigcommerce', 'hybris', 'commercetools', 'amp'];
var backendKeys = [];
// command line arguments
var graphqlHost = nconf.argv().get('graphqlHost') || "http://localhost:6393";
var graphqlUrl = graphqlHost + "/graphql";
var key = nconf.argv().get('backendKey');
var TestResults = /** @class */ (function () {
    function TestResults() {
    }
    return TestResults;
}());
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bkResponse, results, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log("Testing against server " + chalk.bgBlueBright(graphqlUrl));
                console.log();
                return [4 /*yield*/, axios.get(graphqlHost + "/keys")];
            case 1:
                bkResponse = _a.sent();
                backendKeys = bkResponse.data;
                // backendKeys = [_.first(backendKeys)]
                // backendKeys = [_.find(backendKeys, k => k.indexOf('hybris') > -1)]
                if (key) {
                    backendKeys = [key];
                }
                backendKeys = _.filter(backendKeys, function (bk) { return _.indexOf(commerceCodecKeyPrefixes, bk.split('/')[0]) > -1; });
                console.log("Testing backend keys");
                _.each(backendKeys, function (bk) { return console.log("\t" + chalk.yellow(bk)); });
                console.log(chalk.gray("\n\nPlease wait..."));
                return [4 /*yield*/, Promise.all(backendKeys.map(function (backendKey) { return __awaiter(void 0, void 0, void 0, function () {
                        var client, _a, type, key, mapped, flattenCategories, results, products, product, topLevelCategories, secondLevelCategories, thirdLevelCategories, category, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    client = new __1.PbxCommerceClient({ url: graphqlUrl, key: backendKey });
                                    _a = backendKey.split('/'), type = _a[0], key = _a[1];
                                    mapped = {};
                                    flattenCategories = function (cats) {
                                        _.each(cats, function (cat) {
                                            mapped[cat.id] = cat;
                                            flattenCategories(cat.children);
                                        });
                                    };
                                    results = {};
                                    if (!(_.indexOf(commerceCodecKeyPrefixes, type) > -1)) return [3 /*break*/, 6];
                                    results.backendKey = backendKey;
                                    return [4 /*yield*/, client.getProducts(new types_1.QueryContext())];
                                case 1:
                                    products = _e.sent();
                                    console.log(products);
                                    results.products = products;
                                    product = _.sample(products);
                                    return [4 /*yield*/, client.getCategories(new types_1.QueryContext())];
                                case 2:
                                    topLevelCategories = _e.sent();
                                    flattenCategories(topLevelCategories);
                                    secondLevelCategories = _.flatten(_.map(topLevelCategories, 'children'));
                                    thirdLevelCategories = _.flatten(_.map(secondLevelCategories, 'children'));
                                    results.categories = {
                                        topLevel: topLevelCategories,
                                        secondLevel: secondLevelCategories,
                                        thirdLevel: thirdLevelCategories
                                    };
                                    category = _.sample(Object.values(mapped));
                                    _b = results;
                                    return [4 /*yield*/, client.getCategory(new types_1.QueryContext({ args: { id: category.id } }))];
                                case 3:
                                    _b.categoryById = _e.sent();
                                    _c = results;
                                    return [4 /*yield*/, client.getProduct(new types_1.QueryContext({ args: { id: product.id } }))];
                                case 4:
                                    _c.productById = _e.sent();
                                    _d = results;
                                    return [4 /*yield*/, client.getCategory(new types_1.QueryContext({ args: { slug: category.slug } }))];
                                case 5:
                                    _d.categoryBySlug = _e.sent();
                                    _e.label = 6;
                                case 6: return [2 /*return*/, results];
                            }
                        });
                    }); }))];
            case 2:
                results = _a.sent();
                _.each(results, function (result) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    var labelLength = Math.max(result.categoryById.id.length, result.categoryBySlug.slug.length, result.productById.id.length);
                    console.log();
                    console.log(chalk.gray(result.backendKey));
                    console.log('-'.padStart(result.backendKey.length, '-'));
                    console.log("    products:         [ " + chalk.green((_a = result.products) === null || _a === void 0 ? void 0 : _a.length) + " ]");
                    console.log("    categories (top): [ " + chalk.magenta((_c = (_b = result.categories) === null || _b === void 0 ? void 0 : _b.topLevel) === null || _c === void 0 ? void 0 : _c.length) + " ]");
                    console.log("               (2nd): [ " + chalk.magenta((_e = (_d = result.categories) === null || _d === void 0 ? void 0 : _d.secondLevel) === null || _e === void 0 ? void 0 : _e.length) + " ]");
                    console.log("               (3rd): [ " + chalk.magenta((_g = (_f = result.categories) === null || _f === void 0 ? void 0 : _f.thirdLevel) === null || _g === void 0 ? void 0 : _g.length) + " ]");
                    console.log();
                    console.log("    category [ id:   " + chalk.yellow(result.categoryById.id) + ''.padStart(labelLength - result.categoryById.id.length, ' ') + " ]...\u2705");
                    console.log("    category [ slug: " + chalk.yellow(result.categoryBySlug.slug) + ''.padStart(labelLength - result.categoryBySlug.slug.length, ' ') + " ]...\u2705");
                    console.log("    product  [ id:   " + chalk.yellow(result.productById.id) + ''.padStart(labelLength - result.productById.id.length, ' ') + " ]...\u2705");
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                console.error(error_1.stack);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
run();
