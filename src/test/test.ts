import "reflect-metadata"

const _ = require('lodash')
const chalk = require('chalk')
const nconf = require('nconf')
const axios = require('axios')

import { Product, Category } from '@amp-nova/amp-rsa-types'
import { CommerceClient, QueryContext } from '../types'
import { PbxCommerceClient } from '../client/pbx-commerce-client'

let commerceBackendKeyPrefixes = ['bigcommerce', 'hybris', 'commercetools']
let backendKeys = []

// command line arguments
const graphqlHost = nconf.argv().get('graphqlHost') || `http://localhost:6393`
const graphqlUrl = `${graphqlHost}/graphql`

const key = nconf.argv().get('backendKey')

class TestResults {
    backendKey?: string
    products?:   Product[]
    categories?: {
        topLevel?: Category[],
        secondLevel?: Category[],
        thirdLevel?: Category[]
    }
    categoryById?: Category
    categoryBySlug?: Category
    productById?: Product
}

let run = async () => {
    try {
        console.log(`Testing against server ${chalk.bgBlueBright(graphqlUrl)}`)
        console.log()

        let bkResponse = await axios.get(`${graphqlHost}/keys`)
        backendKeys = bkResponse.data

        // backendKeys = [_.first(backendKeys)]
        // backendKeys = [_.find(backendKeys, k => k.indexOf('hybris') > -1)]

        if (key) {
            backendKeys = [_.find(backendKeys, k => key === k)]
        }

        backendKeys = _.filter(backendKeys, bk => _.indexOf(commerceBackendKeyPrefixes, bk.split('/')[0]) > -1)

        console.log(`Testing backend keys`)
        _.each(backendKeys, bk => console.log(`\t${chalk.yellow(bk)}`))
        console.log(chalk.gray(`\n\nPlease wait...`))
        let results = await Promise.all(backendKeys.map(async backendKey => {
            let client: CommerceClient = new PbxCommerceClient(graphqlUrl, backendKey)

            let [type, key] = backendKey.split('/')
            let mapped = {}
            let flattenCategories = cats => {
                _.each(cats, cat => {
                    mapped[cat.id] = cat
                    flattenCategories(cat.children)
                })
            }

            let results: TestResults = {}

            if (_.indexOf(commerceBackendKeyPrefixes, type) > -1) {
                results.backendKey = backendKey

                let products: Product[] = await client.getProducts(new QueryContext({}))
                results.products = products

                let product: Product = _.sample(products)

                let topLevelCategories = await client.getCategories(new QueryContext({}))
                flattenCategories(topLevelCategories)

                let secondLevelCategories = _.flatten(_.map(topLevelCategories, 'children'))
                let thirdLevelCategories = _.flatten(_.map(secondLevelCategories, 'children'))

                results.categories = {
                    topLevel: topLevelCategories,
                    secondLevel: secondLevelCategories,
                    thirdLevel: thirdLevelCategories
                }

                let category: Category = _.sample(Object.values(mapped))
                results.categoryById = await client.getCategory(new QueryContext({ id: category.id }))
                results.productById = await client.getProduct(new QueryContext({ id: product.id }))
                results.categoryBySlug = await client.getCategory(new QueryContext({ slug: category.slug }))
            }
            return results
        }))

        _.each(results, result => {
            let labelLength = Math.max(result.categoryById.id.length, result.categoryBySlug.slug.length, result.productById.id.length)

            console.log()
            console.log(chalk.gray(result.backendKey))
            console.log('-'.padStart(result.backendKey.length, '-'))
            console.log(`    products:         [ ${chalk.green(result.products?.length)} ]`)

            console.log(`    categories (top): [ ${chalk.magenta(result.categories?.topLevel?.length)} ]`)
            console.log(`               (2nd): [ ${chalk.magenta(result.categories?.secondLevel?.length)} ]`)
            console.log(`               (3rd): [ ${chalk.magenta(result.categories?.thirdLevel?.length)} ]`)
            console.log()

            console.log(`    category [ id:   ${chalk.yellow(result.categoryById.id)}${''.padStart(labelLength - result.categoryById.id.length, ' ')} ]...✅`)
            console.log(`    category [ slug: ${chalk.yellow(result.categoryBySlug.slug)}${''.padStart(labelLength - result.categoryBySlug.slug.length, ' ')} ]...✅`)
            console.log(`    product  [ id:   ${chalk.yellow(result.productById.id)}${''.padStart(labelLength - result.productById.id.length, ' ')} ]...✅`)
        })
    } catch (error) {
        console.error(error)
        console.error(error.stack)
    }
}

run()