import _ from 'lodash'
import url from 'whatwg-url'
const router = require('express').Router()
const { nanoid } = require('nanoid')

import { getCodec } from '../codec'

import { config } from "./config";
import { default as logger } from './logger'

router.use(async (req, res, next) => {
    if ((req.path.indexOf('graphql') > -1 && req.body?.operationName !== 'IntrospectionQuery') || req.path.indexOf('api/') > -1) {
        const codecKey = req.headers['x-aria-codec-key'] || req.headers['x-aria-backend-key'] || req.headers['x-pbx-codec-key'] || req.headers['x-pbx-backend-key'] || req.headers['x-arm-backend-key'] || req.headers['x-commerce-backend-key']

        if (codecKey) {
            const appUrl = url.parseURL(req.headers['x-aria-app-url'] || `http://localhost:3000`)
            const bareHost = _.first(appUrl.host.split('.'))
            const graphqlOrigin = url.serializeURLOrigin(url.parseURL(config.host))
    
            const tag = req.path.indexOf('graphql') > -1 ? req.body.operationName || `anonymousQuery` : req.path.split('/').pop()
            req.correlationId = `${bareHost}-${codecKey.replace('/', '-')}-${tag}-${nanoid(4)}`
            req.headers['x-aria-correlation-id'] = req.correlationId
    
            logger.info(`${graphqlOrigin}/logs/${req.correlationId}`)
    
            req.codec = await getCodec({
                codecKey,
                requestId:      req.correlationId,
                logger:         await logger.getObjectLogger(req.correlationId),
                locale:         req.headers['x-aria-locale'] || 'en-US',
                language:       req.headers['x-aria-language'] || 'en',
                country:        req.headers['x-aria-country'] || 'US',
                currency:       req.headers['x-aria-currency'] || 'USD',
                appUrl:         req.headers['x-aria-app-url'],
                segment:        req.headers['x-aria-segment']
            })
        }
    }

    next()
})

module.exports = router