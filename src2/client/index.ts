import _ from 'lodash'
import fetch from 'cross-fetch'
import { createHttpLink, ApolloClient, InMemoryCache, from } from '@apollo/client/core';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

import { categoryQuery, categoryHierarchyQuery, productQuery, productsQuery } from './queries'
import { QueryContext, CommerceClient, Product, Category } from '../../src/types'

export class AriaCommerceClient implements CommerceClient {
    url: string
    key: string

    constructor({ url, key }) {
        if (_.isEmpty(url) || _.isEmpty(key)) {
            throw `aria client requires a url and key`
        }
        this.url = url
        this.key = key
    }

    getGraphqlClient = (context: QueryContext) => {
        let self = this
        const httpLink = createHttpLink({ uri: this.url, fetch })

        const authLink = setContext((_, { headers }) => ({
            headers: {
                ...headers,
                'x-aria-backend-key': self.key,
                'x-aria-locale': context.locale,
                'x-aria-language': context.language,
                'x-aria-country': context.country,
                'x-aria-currency': context.currency,
                'x-aria-app-url': context.appUrl,
                'x-aria-segment': context.segment
            }
        }))

        const errorLink = onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) => console.error(`[ gql ]: Message: ${message}, Location: ${locations}, Path: ${path}`));
            if (networkError) console.error(`[ net ]: ${networkError}`);
        });

        let client = new ApolloClient({
            link: from([errorLink, authLink.concat(httpLink)]),
            cache: new InMemoryCache()
        });

        return {
            query: (query: any) => {
                return client.query({ query, variables: context.args })
            }
        }
    };

    getProduct = async function (context: QueryContext): Promise<Product> {
        let client = this.getGraphqlClient(context)
        let result: any = await client.query(productQuery)
        return result.data.product
    }

    getProducts = async function (context: QueryContext): Promise<Product[]> {
        let client = this.getGraphqlClient(context)
        let result: any = await client.query(productsQuery)
        return result.data.products.results
    }

    getCategories = async function (context: QueryContext): Promise<Category[]> {
        let client = this.getGraphqlClient(context)
        let result: any = await client.query(categoryHierarchyQuery)
        return result.data.categoryHierarchy
    }

    getCategory = async function (context: QueryContext): Promise<Category> {
        let client = this.getGraphqlClient(context)
        let result: any = await client.query(categoryQuery)
        return result.data.category
    }
}

export default AriaCommerceClient
