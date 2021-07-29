const axios = require('axios')
const logger = require('../logger')

module.exports = async (request) => {
    logger.info(`[ ${request.method.padStart(6, ' ')} ] ${request.url}`)
    return await axios(request)
}