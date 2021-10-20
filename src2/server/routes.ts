import _ from 'lodash'

const router = require('express').Router()
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.codec is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

// health check end point
router.get('/check', (req, res, next) => res.status(200).send({ status: 'ok' }))

// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(_.map((await secretManager.listSecrets({})).SecretList, 'Name')))

// route /api/product to graphql resolvers
import { ProductResolver } from '../../src/server/resolvers/product'
let productResolver = new ProductResolver()
router.get('/api/product', async(req, res) => res.status(200).send(await productResolver.product(req.query, req)))
router.get('/api/products', async(req, res) => res.status(200).send(await productResolver.products(req.query, req)))

// route /api/category to graphql resolvers
import { CategoryResolver } from '../../src/server/resolvers/category'
let categoryResolver = new CategoryResolver()
router.get('/api/category', async(req, res) => res.status(200).send(await categoryResolver.category(req.query, req)))
router.get('/api/categories', async(req, res) => {
    let categories = await categoryResolver.categoryHierarchy(req.query, req)
    let allCategories = []

    const buildCategory = category => {
        allCategories.push(category)
        _.each(category.children, buildCategory)
    }
    _.each(categories, buildCategory)
    res.status(200).send(allCategories)
})
router.get('/api/categoryHierarchy', async(req, res) => {
    let categories = await categoryResolver.categoryHierarchy(req.query, req)
    await Promise.all(categories.map(async category => category.products = await categoryResolver.products(category, {}, req)))
    res.status(200).send(categories)
})

export default router