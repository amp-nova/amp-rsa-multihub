"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("./resolvers/product");
const category_1 = require("./resolvers/category");
const variant_1 = require("./resolvers/variant");
const misc_1 = require("./resolvers/misc");
module.exports = [product_1.ProductResolver, category_1.CategoryResolver, variant_1.VariantResolver, misc_1.MiscResolver];
