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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const router = require('express').Router();
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
// note: if config.codec is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager();
// health check end point
router.get('/check', (req, res, next) => res.status(200).send({ status: 'ok' }));
// get the list of keys to test
router.get('/keys', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).send(lodash_1.default.map((yield secretManager.listSecrets({})).SecretList, 'Name')); }));
// route /api/product to graphql resolvers
const product_1 = require("../../src/server/resolvers/product");
let productResolver = new product_1.ProductResolver();
router.get('/api/product', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).send(yield productResolver.product(req.query, req)); }));
router.get('/api/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).send(yield productResolver.products(req.query, req)); }));
// route /api/category to graphql resolvers
const category_1 = require("../../src/server/resolvers/category");
let categoryResolver = new category_1.CategoryResolver();
router.get('/api/category', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).send(yield categoryResolver.category(req.query, req)); }));
router.get('/api/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let categories = yield categoryResolver.categoryHierarchy(req.query, req);
    let allCategories = [];
    const buildCategory = category => {
        allCategories.push(category);
        lodash_1.default.each(category.children, buildCategory);
    };
    lodash_1.default.each(categories, buildCategory);
    res.status(200).send(allCategories);
}));
router.get('/api/categoryHierarchy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let categories = yield categoryResolver.categoryHierarchy(req.query, req);
    yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () { return category.products = yield categoryResolver.products(category, {}, req); })));
    res.status(200).send(categories);
}));
exports.default = router;
