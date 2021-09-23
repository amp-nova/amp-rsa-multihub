"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Category_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbxClient = exports.PbxQueryContext = exports.GetAttributeArgs = exports.GetProductArgs = exports.GetProductsArgs = exports.GetCategoryProductArgs = exports.GetCategoryArgs = exports.Context = exports.ListArgs = exports.CommonArgs = exports.SearchResult = exports.Category = exports.Variant = exports.Attribute = exports.Product = exports.CommerceObject = exports.Identifiable = exports.CategoryResults = exports.ProductResults = exports.ResultsMeta = exports.ProductImage = exports.Prices = void 0;
const type_graphql_1 = require("type-graphql");
let Prices = class Prices {
};
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
exports.Prices = Prices;
let ProductImage = class ProductImage {
};
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
exports.ProductImage = ProductImage;
let ResultsMeta = class ResultsMeta {
};
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
exports.ResultsMeta = ResultsMeta;
let ProductResults = class ProductResults {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", ResultsMeta)
], ProductResults.prototype, "meta", void 0);
__decorate([
    type_graphql_1.Field(type => [Product]),
    __metadata("design:type", Array)
], ProductResults.prototype, "results", void 0);
ProductResults = __decorate([
    type_graphql_1.ObjectType()
], ProductResults);
exports.ProductResults = ProductResults;
let CategoryResults = class CategoryResults {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", ResultsMeta)
], CategoryResults.prototype, "meta", void 0);
__decorate([
    type_graphql_1.Field(type => [Category]),
    __metadata("design:type", Array)
], CategoryResults.prototype, "results", void 0);
CategoryResults = __decorate([
    type_graphql_1.ObjectType()
], CategoryResults);
exports.CategoryResults = CategoryResults;
let Identifiable = class Identifiable {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Identifiable.prototype, "id", void 0);
Identifiable = __decorate([
    type_graphql_1.ObjectType()
], Identifiable);
exports.Identifiable = Identifiable;
let CommerceObject = class CommerceObject extends Identifiable {
};
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
exports.CommerceObject = CommerceObject;
let Product = class Product extends CommerceObject {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "shortDescription", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "longDescription", void 0);
__decorate([
    type_graphql_1.Field(type => [Category]),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    type_graphql_1.Field(type => [Variant]),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Product.prototype, "productType", void 0);
Product = __decorate([
    type_graphql_1.ObjectType()
], Product);
exports.Product = Product;
let Attribute = class Attribute {
};
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
exports.Attribute = Attribute;
let Variant = class Variant extends Identifiable {
};
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
    type_graphql_1.Field(type => [ProductImage]),
    __metadata("design:type", Array)
], Variant.prototype, "images", void 0);
__decorate([
    type_graphql_1.Field(type => [Attribute]),
    __metadata("design:type", Array)
], Variant.prototype, "attributes", void 0);
Variant = __decorate([
    type_graphql_1.ObjectType()
], Variant);
exports.Variant = Variant;
let Category = Category_1 = class Category extends CommerceObject {
};
__decorate([
    type_graphql_1.Field(type => [Category_1]),
    __metadata("design:type", Array)
], Category.prototype, "children", void 0);
__decorate([
    type_graphql_1.Field(type => [Product]),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = Category_1 = __decorate([
    type_graphql_1.ObjectType()
], Category);
exports.Category = Category;
let SearchResult = class SearchResult {
};
__decorate([
    type_graphql_1.Field(type => [Product]),
    __metadata("design:type", Array)
], SearchResult.prototype, "products", void 0);
SearchResult = __decorate([
    type_graphql_1.ObjectType()
], SearchResult);
exports.SearchResult = SearchResult;
let CommonArgs = class CommonArgs {
};
CommonArgs = __decorate([
    type_graphql_1.ArgsType()
], CommonArgs);
exports.CommonArgs = CommonArgs;
let ListArgs = class ListArgs extends CommonArgs {
};
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
exports.ListArgs = ListArgs;
class Context {
}
exports.Context = Context;
let GetCategoryArgs = class GetCategoryArgs extends CommonArgs {
};
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
exports.GetCategoryArgs = GetCategoryArgs;
let GetCategoryProductArgs = class GetCategoryProductArgs extends CommonArgs {
};
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
exports.GetCategoryProductArgs = GetCategoryProductArgs;
let GetProductsArgs = class GetProductsArgs extends ListArgs {
};
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
exports.GetProductsArgs = GetProductsArgs;
let GetProductArgs = class GetProductArgs extends CommonArgs {
};
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
exports.GetProductArgs = GetProductArgs;
let GetAttributeArgs = class GetAttributeArgs {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GetAttributeArgs.prototype, "name", void 0);
GetAttributeArgs = __decorate([
    type_graphql_1.ArgsType()
], GetAttributeArgs);
exports.GetAttributeArgs = GetAttributeArgs;
class PbxQueryContext {
}
exports.PbxQueryContext = PbxQueryContext;
class PbxClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }
    sayHello() {
        console.log(`say hello! my url is [ ${this.url} ] and my key is [ ${this.key} ]`);
    }
    async getProducts(context) {
        throw new Error('Subclasses of PbxClient must implement getProducts(context: PbxQueryContext)');
    }
    async getProduct(context) {
        throw new Error('Subclasses of PbxClient must implement getProduct(context: PbxQueryContext)');
    }
}
exports.PbxClient = PbxClient;
exports.default = { PbxClient, PbxQueryContext };
