import _ from 'lodash'
import fetch from 'cross-fetch'
import { createHttpLink, ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { categoryQuery, categoryHierarchyQuery, productQuery, productsQuery } from './queries'
import { Product, Category, PbxClient, PbxQueryContext } from './types'

const stringify = require('json-stringify-safe')

export const defaultPbxQueryContext: PbxQueryContext = {
    args: {},
    locale: 'en',
    country: 'US',
    currency: 'USD',
    appUrl: 'http://localhost:3000'
}

export class PbxGraphqlClient extends PbxClient {
    getGraphqlClient = (context: PbxQueryContext) => {
        // console.log(`args ${stringify(context.args)}`)

        let self = this
        const httpLink = createHttpLink({ uri: this.url, fetch })

        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    'x-pbx-backend-key': self.key,
                    'x-pbx-locale': context.locale,
                    'x-pbx-country': context.country,
                    'x-pbx-currency': context.currency,
                    'x-pbx-app-url': context.appUrl
                }
            }
        })

        let client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
        });

        return {
            query: (query: any) => {
                return client.query({ query, variables: context.args })
            }
        }
    };

    getProduct = async function(context: PbxQueryContext): Promise<Product> {
        let client = this.getGraphqlClient({ ...defaultPbxQueryContext, ...context })
        let result: any = await client.query(productQuery)
        return result.data.product
    }

    getProducts = async function(context: PbxQueryContext): Promise<Product[]> {
        let client = this.getGraphqlClient({ ...defaultPbxQueryContext, ...context })
        let result: any = await client.query(productsQuery)
        return result.data.products.results
    }

    getCategories = async function(context: PbxQueryContext): Promise<Category[]> {
        let client = this.getGraphqlClient({ ...defaultPbxQueryContext, ...context })
        let result: any = await client.query(categoryHierarchyQuery)
        return result.data.categoryHierarchy
    }

    getCategory = async function(context: PbxQueryContext): Promise<Category> {
        let client = this.getGraphqlClient({ ...defaultPbxQueryContext, ...context })
        let result: any = await client.query(categoryQuery)
        return result.data.category
    }
}

export * from './types'