const { readFileSync } = require('fs')
const yaml = require('js-yaml');
const fs = require('fs-extra')
const branchName = require('current-git-branch')

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();

// Converting from YAML to JSON
let settings = yaml.load(settingsYAML)
let packageJson = fs.readJSONSync('./package.json')

module.exports = {
    ...settings,
    packageJson,
    git: {
        branch: branchName()
    }
}