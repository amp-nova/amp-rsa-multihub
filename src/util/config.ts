const { readFileSync } = require('fs')
const yaml = require('js-yaml');
const fs = require('fs-extra')
const branchName = require('current-git-branch')
const nconf = require('nconf')

let args = nconf.argv().env()

// Reading global settings
// const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();

// Converting from YAML to JSON
// let settings = yaml.load(settingsYAML)
let packageJson = fs.readJSONSync('./package.json')

const port = process.env.PORT || 6393
const appMode = process.env.COPILOT_ENVIRONMENT_NAME || 'local'
const appName = process.env.COPILOT_APPLICATION_NAME || 'nova'
const serviceName = process.env.COPILOT_SERVICE_NAME || 'pbx'
const serviceHost = appMode === 'local' ? `http://localhost:${port}` : `https://${serviceName}.${appMode}.${appName}.${process.env.pbx_domain}`

module.exports = {
    packageJson,
    app: {
        name: serviceName,
        mode: appMode,
        host: serviceHost,
        port
    },
    git: {
        branch: branchName()
    }
}