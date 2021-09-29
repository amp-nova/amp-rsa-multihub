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
exports.CommerceClient = exports.QueryContext = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Context = exports.ListArgs = exports.CommonArgs = exports.SearchResult = exports.Category = exports.Variant = exports.Attribute = exports.Product = exports.CommerceObject = exports.Identifiable = exports.CategoryResults = exports.ProductResults = exports.ResultsMeta = exports.ProductImage = exports.Prices = void 0;
var type_graphql_1 = require("type-graphql");
var Prices = /** @class */ (function () {
    function Prices() {
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], Prices.prototype, "sale", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], Prices.prototype, "list", void 0);
    Prices = __decorate([
        type_graphql_1.ObjectType()
    ], Prices);
    return Prices;
}());
exports.Prices = Prices;
var ProductImage = /** @class */ (function () {
    function ProductImage() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], ProductImage.prototype, "url", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], ProductImage.prototype, "large", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], ProductImage.prototype, "thumb", void 0);
    ProductImage = __decorate([
        type_graphql_1.ObjectType()
    ], ProductImage);
    return ProductImage;
}());
exports.ProductImage = ProductImage;
var ResultsMeta = /** @class */ (function () {
    function ResultsMeta() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", Number)
    ], ResultsMeta.prototype, "limit", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", Number)
    ], ResultsMeta.prototype, "offset", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", Number)
    ], ResultsMeta.prototype, "count", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", Number)
    ], ResultsMeta.prototype, "total", void 0);
    ResultsMeta = __decorate([
        type_graphql_1.ObjectType()
    ], ResultsMeta);
    return ResultsMeta;
}());
exports.ResultsMeta = ResultsMeta;
var ProductResults = /** @class */ (function () {
    function ProductResults() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", ResultsMeta)
    ], ProductResults.prototype, "meta", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Product]; }),
        __metadata("design:type", Array)
    ], ProductResults.prototype, "results", void 0);
    ProductResults = __decorate([
        type_graphql_1.ObjectType()
    ], ProductResults);
    return ProductResults;
}());
exports.ProductResults = ProductResults;
var CategoryResults = /** @class */ (function () {
    function CategoryResults() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", ResultsMeta)
    ], CategoryResults.prototype, "meta", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Category]; }),
        __metadata("design:type", Array)
    ], CategoryResults.prototype, "results", void 0);
    CategoryResults = __decorate([
        type_graphql_1.ObjectType()
    ], CategoryResults);
    return CategoryResults;
}());
exports.CategoryResults = CategoryResults;
var Identifiable = /** @class */ (function () {
    function Identifiable() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], Identifiable.prototype, "id", void 0);
    Identifiable = __decorate([
        type_graphql_1.ObjectType()
    ], Identifiable);
    return Identifiable;
}());
exports.Identifiable = Identifiable;
var CommerceObject = /** @class */ (function (_super) {
    __extends(CommerceObject, _super);
    function CommerceObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], CommerceObject.prototype, "slug", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], CommerceObject.prototype, "name", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], CommerceObject.prototype, "raw", void 0);
    CommerceObject = __decorate([
        type_graphql_1.ObjectType()
    ], CommerceObject);
    return CommerceObject;
}(Identifiable));
exports.CommerceObject = CommerceObject;
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], Product.prototype, "shortDescription", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", String)
    ], Product.prototype, "longDescription", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Category]; }),
        __metadata("design:type", Array)
    ], Product.prototype, "categories", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Variant]; }),
        __metadata("design:type", Array)
    ], Product.prototype, "variants", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], Product.prototype, "productType", void 0);
    Product = __decorate([
        type_graphql_1.ObjectType()
    ], Product);
    return Product;
}(CommerceObject));
exports.Product = Product;
var Attribute = /** @class */ (function () {
    function Attribute() {
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], Attribute.prototype, "name", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], Attribute.prototype, "value", void 0);
    Attribute = __decorate([
        type_graphql_1.ObjectType()
    ], Attribute);
    return Attribute;
}());
exports.Attribute = Attribute;
var Variant = /** @class */ (function (_super) {
    __extends(Variant, _super);
    function Variant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], Variant.prototype, "sku", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", Prices)
    ], Variant.prototype, "prices", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", ProductImage)
    ], Variant.prototype, "defaultImage", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [ProductImage]; }),
        __metadata("design:type", Array)
    ], Variant.prototype, "images", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Attribute]; }),
        __metadata("design:type", Array)
    ], Variant.prototype, "attributes", void 0);
    Variant = __decorate([
        type_graphql_1.ObjectType()
    ], Variant);
    return Variant;
}(Identifiable));
exports.Variant = Variant;
var Category = /** @class */ (function (_super) {
    __extends(Category, _super);
    function Category() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Category_1 = Category;
    var Category_1;
    __decorate([
        type_graphql_1.Field(function (type) { return [Category_1]; }),
        __metadata("design:type", Array)
    ], Category.prototype, "children", void 0);
    __decorate([
        type_graphql_1.Field(function (type) { return [Product]; }),
        __metadata("design:type", Array)
    ], Category.prototype, "products", void 0);
    Category = Category_1 = __decorate([
        type_graphql_1.ObjectType()
    ], Category);
    return Category;
}(CommerceObject));
exports.Category = Category;
var SearchResult = /** @class */ (function () {
    function SearchResult() {
    }
    __decorate([
        type_graphql_1.Field(function (type) { return [Product]; }),
        __metadata("design:type", Array)
    ], SearchResult.prototype, "products", void 0);
    SearchResult = __decorate([
        type_graphql_1.ObjectType()
    ], SearchResult);
    return SearchResult;
}());
exports.SearchResult = SearchResult;
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
