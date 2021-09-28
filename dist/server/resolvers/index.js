"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_1 = require("./product");
var category_1 = require("./category");
var variant_1 = require("./variant");
var misc_1 = require("./misc");
exports.default = [product_1.ProductResolver, category_1.CategoryResolver, variant_1.VariantResolver, misc_1.MiscResolver];
