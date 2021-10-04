import _ from 'lodash'
import logger from '@/server/util/logger';
import resolvers from '@/server/resolvers'

const { ApolloServer } = require('apollo-server-express');
import { ArgsType, Field, ObjectType } from "type-graphql";
const { buildSchema } = require('type-graphql')
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds')

import { 
    Prices, ProductImage, ResultsMeta, ProductResults, CategoryResults, Identifiable, 
    CommerceObject, Product, Attribute, Variant, Category, SearchResult 
} from 'amp-rsa-types'

import { CommonArgs, ListArgs, GetAttributeArgs, GetCategoryArgs, GetProductArgs, GetProductsArgs } from '../../types'
import { GetCategoryProductArgs } from '@/index';

const stringField = {
    nullable: Field(type => String, { nullable: true }),
    nonNullable: Field(type => String, { nullable: false })
}

const numberField = {
    nullable: Field(type => Number, { nullable: true }),
    nonNullable: Field(type => Number, { nullable: false })
}

// Prices
ObjectType({})(Prices)
stringField.nullable(Prices.prototype, 'sale')
stringField.nullable(Prices.prototype, 'list')

// ProductImage
ObjectType({})(ProductImage)
stringField.nonNullable(ProductImage.prototype, 'url')
stringField.nullable(ProductImage.prototype, 'large')
stringField.nullable(ProductImage.prototype, 'thumb')

// ResultsMeta
ObjectType({})(ResultsMeta)
numberField.nonNullable(ResultsMeta.prototype, 'limit')
numberField.nonNullable(ResultsMeta.prototype, 'offset')
numberField.nonNullable(ResultsMeta.prototype, 'count')
numberField.nonNullable(ResultsMeta.prototype, 'total')

// ProductResults
ObjectType({})(ProductResults)
Field(type => ResultsMeta)(ProductResults.prototype, 'meta')
Field(type => [Product])(ProductResults.prototype, 'results')

// CategoryResults
ObjectType({})(CategoryResults)
Field(type => ResultsMeta)(CategoryResults.prototype, 'meta')
Field(type => [Category])(CategoryResults.prototype, 'results')

// Identifiable
ObjectType({})(Identifiable)
stringField.nonNullable(Identifiable.prototype, 'id')

// CommerceObject
ObjectType({})(CommerceObject)
stringField.nonNullable(CommerceObject.prototype, 'slug')
stringField.nonNullable(CommerceObject.prototype, 'name')
stringField.nonNullable(CommerceObject.prototype, 'raw')

// Product
ObjectType({})(Product)
stringField.nonNullable(Product.prototype, 'productType')
stringField.nullable(Product.prototype, 'shortDescription')
stringField.nullable(Product.prototype, 'longDescription')
Field(type => [Category])(Product.prototype, 'categories')
Field(type => [Variant])(Product.prototype, 'variants')

// Attribute
ObjectType({})(Attribute)
stringField.nonNullable(Attribute.prototype, 'name')
stringField.nonNullable(Attribute.prototype, 'value')

// Variant
ObjectType({})(Variant)
stringField.nonNullable(Variant.prototype, 'sku')
stringField.nullable(Variant.prototype, 'color')
stringField.nullable(Variant.prototype, 'size')
stringField.nullable(Variant.prototype, 'articleNumberMax')
Field(type => Prices)(Variant.prototype, 'prices')
Field(type => ProductImage, { nullable: true })(Variant.prototype, 'defaultImage')
Field(type => [ProductImage])(Variant.prototype, 'images')
Field(type => [Attribute])(Variant.prototype, 'attributes')

// Category
ObjectType({})(Category)
Field(type => [Category])(Category.prototype, 'children')
Field(type => [Product])(Category.prototype, 'products')

// SearchResult
ObjectType({})(SearchResult)
Field(type => [Product])(Category.prototype, 'products')

// CommonArgs
ArgsType()(CommonArgs)

// GetCategoryProductArgs
ArgsType()(GetCategoryProductArgs)

// ListArgs
ArgsType()(ListArgs)
numberField.nullable(ListArgs.prototype, 'limit')
numberField.nullable(ListArgs.prototype, 'offset')

// GetCategoryArgs
ArgsType()(GetCategoryArgs)
stringField.nullable(GetCategoryArgs.prototype, 'id')
stringField.nullable(GetCategoryArgs.prototype, 'slug')

// GetProductsArgs
ArgsType()(GetProductsArgs)
stringField.nullable(GetProductsArgs.prototype, 'keyword')
stringField.nullable(GetProductsArgs.prototype, 'productIds')

// GetProductArgs
ArgsType()(GetProductArgs)
stringField.nullable(GetProductArgs.prototype, 'id')
stringField.nullable(GetProductArgs.prototype, 'sku')
stringField.nullable(GetProductArgs.prototype, 'slug')

// GetAttributeArgs
ArgsType()(GetAttributeArgs)
stringField.nullable(GetAttributeArgs.prototype, 'name')

export async function startGraphqlService(app) {
    const server = new ApolloServer({
        schema: await buildSchema({ resolvers }),
        playground: true,
        introspection: true,
        context: async ({ req }) => ({ commercehub: req.hub })
    });

    server.applyMiddleware({ app })

    app.post('/graphql', async (req, res, next) => {
        if (req.body && req.body.operationName !== 'IntrospectionQuery') {
            const objectLogger: any = await logger.getObjectLogger(req.correlationId)
    
            const requestStart = new Date()
            const xsend = res.send.bind(res);
            res.send = body => {
                let requestDuration = differenceInMilliseconds(new Date(), requestStart)
    
                let payload = JSON.parse(body)
                res.status(payload.errors ? 400 : 200)
    
                objectLogger.logGraphqlCall({
                    duration: requestDuration,
                    request: _.pick(req, ['method', 'statusMessage', 'statusCode', 'originalUrl', 'params', 'body', 'headers', 'url', 'query', 'length']),
                    response: {
                        statusCode: res.statusCode,
                        data: payload
                    }
                })
                xsend(body)
            }
        }
        next()
    })
}