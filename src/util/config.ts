const { readFileSync } = require('fs')
const yaml = require('js-yaml');
const fs = require('fs-extra')
const branchName = require('current-git-branch')
const nconf = require('nconf')

let args = nconf.argv()

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();

// Converting from YAML to JSON
let settings = yaml.load(settingsYAML)
let packageJson = fs.readJSONSync('./package.json')

module.exports = {
    ...settings,
    packageJson,
    app: {
        mode: args.get('app_mode')
    },
    git: {
        branch: branchName()
    }
}