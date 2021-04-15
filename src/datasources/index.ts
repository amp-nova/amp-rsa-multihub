let datasourceDirectory = `${__dirname}/../datasources`
let getCommerceBackend = context => require(`${datasourceDirectory}/${context.backendClient.type}`)(context)

const fs = require('fs-extra')

module.exports = context => {
    let provider = require(`${datasourceDirectory}/${context.backendClient.type}`)(context)
    return provider
}