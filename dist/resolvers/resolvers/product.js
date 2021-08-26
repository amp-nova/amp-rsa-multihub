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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../../schemas/types");
let ProductResolver = class ProductResolver {
    async products(args, ctx) {
        return await ctx.commercehub.getProducts(args);
    }
    async product(args, ctx) {
        return await ctx.commercehub.getProduct(args);
    }
};
__decorate([
    type_graphql_1.Query(returns => types_1.ProductResults),
    __param(0, type_graphql_1.Args()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetProductsArgs, types_1.Context]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "products", null);
__decorate([
    type_graphql_1.Query(returns => types_1.Product),
    __param(0, type_graphql_1.Args()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetProductArgs, types_1.Context]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "product", null);
ProductResolver = __decorate([
    type_graphql_1.Resolver(types_1.Product)
], ProductResolver);
exports.ProductResolver = ProductResolver;
module.exports = { ProductResolver };
