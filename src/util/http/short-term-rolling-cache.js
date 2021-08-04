const axios = require('axios')
const _ = require('lodash')
const logger = require('../logger')

let cache = {}

let timer = (url, seconds = 10) => setTimeout(() => {
    logger.debug(`decached [${url}]`)
    delete cache[url] 
}, seconds * 1000)

module.exports = seconds => async (request) => {
    switch (request.method) {
        case 'get':
            if (cache[request.url]) {
                logger.debug(`[  cache ] ${request.url}`)
                clearTimeout(cache[request.url].timeout)
                cache[request.url].timeout = timer(request.url)
                return { 
                    data: cache[request.url].response
                }
            }
            else {
                logger.info(`[ ${request.method.padStart(6, ' ')} ] ${request.url}`)
                let x = await axios(request)
                cache[request.url] = {
                    response: x.data,
                    timeout: timer(request.url, seconds)
                }
                return x
            }
        default:
            logger.info(`[ ${request.method.padStart(6, ' ')} ] ${request.url}`)
            return await axios(request)
    }
}