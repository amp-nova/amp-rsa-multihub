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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantResolver = void 0;
const lodash_1 = __importDefault(require("lodash"));
const type_graphql_1 = require("type-graphql");
const types_1 = require("../../schemas/types");
let VariantResolver = class VariantResolver {
    async attribute(variant, args) {
        return lodash_1.default.get(lodash_1.default.find(variant.attributes, att => att.name.toLowerCase() === args.name.toLowerCase()), 'value');
    }
    async defaultImage(variant) {
        return lodash_1.default.first(variant.images);
    }
};
__decorate([
    type_graphql_1.FieldResolver(returns => String, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.Variant, types_1.GetAttributeArgs]),
    __metadata("design:returntype", Promise)
], VariantResolver.prototype, "attribute", null);
__decorate([
    type_graphql_1.FieldResolver(returns => types_1.ProductImage),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.Variant]),
    __metadata("design:returntype", Promise)
], VariantResolver.prototype, "defaultImage", null);
VariantResolver = __decorate([
    type_graphql_1.Resolver(types_1.Variant)
], VariantResolver);
exports.VariantResolver = VariantResolver;
module.exports = { VariantResolver };
