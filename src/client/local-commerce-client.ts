import _ from 'lodash'
import fetch from 'cross-fetch'
import { createHttpLink, ApolloClient, InMemoryCache, from } from '@apollo/client/core';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

import { categoryQuery, categoryHierarchyQuery, productQuery, productsQuery } from '../queries'
import { Product, Category } from 'amp-rsa-types'
import { QueryContext, CommerceClient } from '../types'

export class LocalCommerceClient extends CommerceClient {
    path: string

    constructor(path) {
        super()
        this.path = path
        console.log(`path ${this.path}`)
    }

    getProduct = async function (context: QueryContext): Promise<Product> {
        return {
            categories: [],
            variants: [],
            productType: '',
            slug: '',
            name: '',
            raw: '',
            id: ''
        }
    }

    getProducts = async function (context: QueryContext): Promise<Product[]> {
        return []
    }

    getCategories = async function (context: QueryContext): Promise<Category[]> {
        return []
    }

    getCategory = async function (context: QueryContext): Promise<Category> {
        return {
            children: [],
            products: [],
            slug: '',
            name: '',
            raw: '',
            id: ''
        }
    }
}

export default LocalCommerceClient