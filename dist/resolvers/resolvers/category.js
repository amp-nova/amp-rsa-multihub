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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../../schemas/types");
let CategoryResolver = class CategoryResolver {
    async category(args, ctx) {
        return await ctx.commercehub.getCategory(args);
    }
    async categoryHierarchy(args, ctx) {
        return await ctx.commercehub.getCategoryHierarchy(args);
    }
    async products(parent, args, ctx) {
        return await ctx.commercehub.getProductsForCategory(parent, args);
    }
};
__decorate([
    type_graphql_1.Query(returns => types_1.Category),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetCategoryArgs, types_1.Context]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    type_graphql_1.Query(returns => [types_1.Category]),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetCategoryArgs, types_1.Context]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categoryHierarchy", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Args()), __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.Category, types_1.GetCategoryProductArgs, types_1.Context]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "products", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver(types_1.Category)
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
module.exports = { CategoryResolver };
