const { readFileSync } = require('fs')
const yaml = require('js-yaml');
const fs = require('fs-extra')

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();

// Converting from YAML to JSON
let settings = yaml.load(settingsYAML)
let packageJson = fs.readJSONSync('./package.json')
let cli = {}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const { exec } = require('child_process');
let init = async () => {
    let result = null
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
        result = { err, stdout, stderr }
        cli['git'] = result.stdout.trim()
    })

    while (!result) {
        await sleep(10)
    }

    return result
}

module.exports = {
    ...settings,
    packageJson,
    cli,
    init
}