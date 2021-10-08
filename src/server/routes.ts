import _ from 'lodash'

const router = require('express').Router()
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.hub is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

// health check end point
router.get('/check', (req, res, next) => res.status(200).send({ status: 'ok' }))

// get the list of keys to test
router.get('/keys', async (req, res) => res.status(200).send(_.map((await secretManager.listSecrets({})).SecretList, 'Name')))

// route /api/product to graphql resolvers
import { ProductResolver } from './resolvers/product'
let productResolver = new ProductResolver()
router.get('/api/product', async(req, res) => res.status(200).send(await productResolver.product(req.query, { commercehub: req.hub })))
router.get('/api/products', async(req, res) => res.status(200).send(await productResolver.products(req.query, { commercehub: req.hub })))

// route /api/category to graphql resolvers
import { CategoryResolver } from './resolvers/category'
let categoryResolver = new CategoryResolver()
router.get('/api/category', async(req, res) => res.status(200).send(await categoryResolver.category(req.query, { commercehub: req.hub })))
router.get('/api/categories', async(req, res) => {
    let categories = await categoryResolver.categoryHierarchy(req.query, { commercehub: req.hub })
    let allCategories = []

    const buildCategory = category => {
        allCategories.push(category)
        _.each(category.children, buildCategory)
    }
    _.each(categories, buildCategory)
    res.status(200).send(allCategories)
})
router.get('/api/categoryHierarchy', async(req, res) => {
    let categories = await categoryResolver.categoryHierarchy(req.query, { commercehub: req.hub })
    await Promise.all(categories.map(async category => category.products = await categoryResolver.products(category, {}, { commercehub: req.hub })))
    res.status(200).send(categories)
})

export default router