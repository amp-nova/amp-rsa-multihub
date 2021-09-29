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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.CommerceClient = exports.QueryContext = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Context = exports.ListArgs = exports.CommonArgs = void 0;
var type_graphql_1 = require("type-graphql");
var amp_rsa_types_1 = require("amp-rsa-types");
var stringField = {
    nullable: type_graphql_1.Field(function (type) { return String; }, { nullable: true }),
    nonNullable: type_graphql_1.Field(function (type) { return String; }, { nullable: false })
};
var numberField = {
    nullable: type_graphql_1.Field(function (type) { return Number; }, { nullable: true }),
    nonNullable: type_graphql_1.Field(function (type) { return Number; }, { nullable: false })
};
// Prices
type_graphql_1.ObjectType({})(amp_rsa_types_1.Prices);
stringField.nullable(amp_rsa_types_1.Prices.prototype, 'sale');
stringField.nullable(amp_rsa_types_1.Prices.prototype, 'list');
// ProductImage
type_graphql_1.ObjectType({})(amp_rsa_types_1.ProductImage);
stringField.nonNullable(amp_rsa_types_1.ProductImage.prototype, 'url');
stringField.nullable(amp_rsa_types_1.ProductImage.prototype, 'large');
stringField.nullable(amp_rsa_types_1.ProductImage.prototype, 'thumb');
// ResultsMeta
type_graphql_1.ObjectType({})(amp_rsa_types_1.ResultsMeta);
numberField.nonNullable(amp_rsa_types_1.ResultsMeta.prototype, 'limit');
numberField.nonNullable(amp_rsa_types_1.ResultsMeta.prototype, 'offset');
numberField.nonNullable(amp_rsa_types_1.ResultsMeta.prototype, 'count');
numberField.nonNullable(amp_rsa_types_1.ResultsMeta.prototype, 'total');
// ProductResults
type_graphql_1.ObjectType({})(amp_rsa_types_1.ProductResults);
type_graphql_1.Field(function (type) { return amp_rsa_types_1.ResultsMeta; })(amp_rsa_types_1.ProductResults.prototype, 'meta');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Product]; })(amp_rsa_types_1.ProductResults.prototype, 'results');
// CategoryResults
type_graphql_1.ObjectType({})(amp_rsa_types_1.CategoryResults);
type_graphql_1.Field(function (type) { return amp_rsa_types_1.ResultsMeta; })(amp_rsa_types_1.CategoryResults.prototype, 'meta');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Category]; })(amp_rsa_types_1.CategoryResults.prototype, 'results');
// Identifiable
type_graphql_1.ObjectType({})(amp_rsa_types_1.Identifiable);
stringField.nonNullable(amp_rsa_types_1.Identifiable.prototype, 'id');
// CommerceObject
type_graphql_1.ObjectType({})(amp_rsa_types_1.CommerceObject);
stringField.nonNullable(amp_rsa_types_1.CommerceObject.prototype, 'slug');
stringField.nonNullable(amp_rsa_types_1.CommerceObject.prototype, 'name');
stringField.nonNullable(amp_rsa_types_1.CommerceObject.prototype, 'raw');
// Product
type_graphql_1.ObjectType({})(amp_rsa_types_1.Product);
stringField.nonNullable(amp_rsa_types_1.Product.prototype, 'productType');
stringField.nullable(amp_rsa_types_1.Product.prototype, 'shortDescription');
stringField.nullable(amp_rsa_types_1.Product.prototype, 'longDescription');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Category]; })(amp_rsa_types_1.Product.prototype, 'categories');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Variant]; })(amp_rsa_types_1.Product.prototype, 'variants');
// Attribute
type_graphql_1.ObjectType({})(amp_rsa_types_1.Attribute);
stringField.nonNullable(amp_rsa_types_1.Attribute.prototype, 'name');
stringField.nonNullable(amp_rsa_types_1.Attribute.prototype, 'value');
// Variant
type_graphql_1.ObjectType({})(amp_rsa_types_1.Variant);
stringField.nonNullable(amp_rsa_types_1.Variant.prototype, 'sku');
stringField.nullable(amp_rsa_types_1.Variant.prototype, 'color');
stringField.nullable(amp_rsa_types_1.Variant.prototype, 'size');
stringField.nullable(amp_rsa_types_1.Variant.prototype, 'articleNumberMax');
type_graphql_1.Field(function (type) { return amp_rsa_types_1.Prices; })(amp_rsa_types_1.Variant.prototype, 'prices');
type_graphql_1.Field(function (type) { return amp_rsa_types_1.ProductImage; }, { nullable: true })(amp_rsa_types_1.Variant.prototype, 'defaultImage');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.ProductImage]; })(amp_rsa_types_1.Variant.prototype, 'images');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Attribute]; })(amp_rsa_types_1.Variant.prototype, 'attributes');
// Category
type_graphql_1.ObjectType({})(amp_rsa_types_1.Category);
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Category]; })(amp_rsa_types_1.Category.prototype, 'children');
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Product]; })(amp_rsa_types_1.Category.prototype, 'products');
// SearchResult
type_graphql_1.ObjectType({})(amp_rsa_types_1.SearchResult);
type_graphql_1.Field(function (type) { return [amp_rsa_types_1.Product]; })(amp_rsa_types_1.Category.prototype, 'products');
var CommonArgs = /** @class */ (function () {
    function CommonArgs() {
    }
    CommonArgs = __decorate([
        type_graphql_1.ArgsType()
    ], CommonArgs);
    return CommonArgs;
}());
exports.CommonArgs = CommonArgs;
var ListArgs = /** @class */ (function (_super) {
    __extends(ListArgs, _super);
    function ListArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", Number)
    ], ListArgs.prototype, "limit", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", Number)
    ], ListArgs.prototype, "offset", void 0);
    ListArgs = __decorate([
        type_graphql_1.ArgsType()
    ], ListArgs);
    return ListArgs;
}(CommonArgs));
exports.ListArgs = ListArgs;
var Context = /** @class */ (function () {
    function Context() {
    }
    return Context;
}());
exports.Context = Context;
var GetCategoryArgs = /** @class */ (function (_super) {
    __extends(GetCategoryArgs, _super);
    function GetCategoryArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetCategoryArgs.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetCategoryArgs.prototype, "slug", void 0);
    GetCategoryArgs = __decorate([
        type_graphql_1.ArgsType()
    ], GetCategoryArgs);
    return GetCategoryArgs;
}(CommonArgs));
exports.GetCategoryArgs = GetCategoryArgs;
var GetCategoryProductArgs = /** @class */ (function (_super) {
    __extends(GetCategoryProductArgs, _super);
    function GetCategoryProductArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", Boolean)
    ], GetCategoryProductArgs.prototype, "full", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetCategoryProductArgs.prototype, "segment", void 0);
    GetCategoryProductArgs = __decorate([
        type_graphql_1.ArgsType()
    ], GetCategoryProductArgs);
    return GetCategoryProductArgs;
}(CommonArgs));
exports.GetCategoryProductArgs = GetCategoryProductArgs;
var GetProductsArgs = /** @class */ (function (_super) {
    __extends(GetProductsArgs, _super);
    function GetProductsArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductsArgs.prototype, "keyword", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductsArgs.prototype, "segment", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductsArgs.prototype, "productIds", void 0);
    GetProductsArgs = __decorate([
        type_graphql_1.ArgsType()
    ], GetProductsArgs);
    return GetProductsArgs;
}(ListArgs));
exports.GetProductsArgs = GetProductsArgs;
var GetProductArgs = /** @class */ (function (_super) {
    __extends(GetProductArgs, _super);
    function GetProductArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductArgs.prototype, "id", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductArgs.prototype, "sku", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductArgs.prototype, "slug", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], GetProductArgs.prototype, "segment", void 0);
    GetProductArgs = __decorate([
        type_graphql_1.ArgsType()
    ], GetProductArgs);
    return GetProductArgs;
}(CommonArgs));
exports.GetProductArgs = GetProductArgs;
var GetAttributeArgs = /** @class */ (function () {
    function GetAttributeArgs() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], GetAttributeArgs.prototype, "name", void 0);
    GetAttributeArgs = __decorate([
        type_graphql_1.ArgsType()
    ], GetAttributeArgs);
    return GetAttributeArgs;
}());
exports.GetAttributeArgs = GetAttributeArgs;
var QueryContext = /** @class */ (function () {
    function QueryContext(args, locale, language, country, currency, segment, appUrl) {
        this.args = args || {};
        this.locale = locale || 'en-US';
        this.language = language || 'en';
        this.country = country || 'US';
        this.currency = currency || 'USD';
        this.segment = segment || '';
        this.appUrl = appUrl || '';
    }
    return QueryContext;
}());
exports.QueryContext = QueryContext;
var CommerceClient = /** @class */ (function () {
    function CommerceClient() {
    }
    CommerceClient.prototype.getProducts = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Subclasses of CommerceClient must implement getProducts(context: QueryContext)');
            });
        });
    };
    CommerceClient.prototype.getProduct = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Subclasses of CommerceClient must implement getProduct(context: QueryContext)');
            });
        });
    };
    CommerceClient.prototype.getCategories = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Subclasses of CommerceClient must implement getCategories(context: QueryContext)');
            });
        });
    };
    CommerceClient.prototype.getCategory = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Subclasses of CommerceClient must implement getCategory(context: QueryContext)');
            });
        });
    };
    return CommerceClient;
}());
exports.CommerceClient = CommerceClient;
exports.default = { QueryContext: QueryContext };
