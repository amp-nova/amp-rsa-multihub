import _ from 'lodash'
import url from 'whatwg-url'
const router = require('express').Router()
const camelcase = require('camelcase')
const { nanoid } = require('nanoid')

const config = require('./config')
const logger = require('./logger')
const hub = require('../hub')

const headersForTag = tag => (val, key) => key.indexOf(`-${tag}-`) > -1
const getAmplienceConfigFromHeaders = headers => {
    const mapHeaders = tag => _.mapKeys(_.pickBy(headers, headersForTag(tag)), (val, key) => camelcase(key.replace(`x-arm-${tag}-`, '')))
    return {
        cmsContext: mapHeaders('cms'),
        userContext: mapHeaders('user'),
        appContext: {
            url: `http://localhost:3000`,
            ...mapHeaders('app')
        }
    }
}

router.use(async (req, res, next) => {
    if (req.path.indexOf('graphql') > -1 || req.path.indexOf('api/') > -1) {
        let { appContext } = getAmplienceConfigFromHeaders(req.headers)

        const appUrl = url.parseURL(appContext.url)
        const bareHost = _.first(appUrl.host.split('.'))
        const graphqlOrigin = url.serializeURLOrigin(url.parseURL(config.app.host))
    
        const tag = req.path.indexOf('graphql') > -1 ? req.body.operationName || `anonymousQuery` : req.path.split('/').pop()
        req.correlationId = `${bareHost}-${(req.headers['x-arm-backend-key'] || req.headers['x-commerce-backend-key']).replace('/', '-')}-${tag}-${nanoid(4)}`
        req.headers['x-arm-correlation-id'] = req.correlationId
    
        logger.info(`${graphqlOrigin}/logs/${req.correlationId}`)
    
        req.hub = await hub({
            backendKey: req.headers['x-arm-backend-key'] || req.headers['x-commerce-backend-key'],
            logger: req.body.operationName !== 'IntrospectionQuery' && await logger.getObjectLogger(req.correlationId),
            ...getAmplienceConfigFromHeaders(req.headers)
        })
    }

    next()
})

module.exports = router