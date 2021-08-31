const axios = require('axios')
const logger = require('../logger')

module.exports = async (request) => {
    return await axios(request)
}