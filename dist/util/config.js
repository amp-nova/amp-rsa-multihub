const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const { execAsync } = require('./helpers');
// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();
// Converting from YAML to JSON
let settings = yaml.load(settingsYAML);
let packageJson = fs.readJSONSync('./package.json');
let cli = {};
module.exports = {
    ...settings,
    packageJson,
    cli,
    init: async () => {
        let result = await execAsync('git rev-parse --abbrev-ref HEAD');
        cli['git'] = result.stdout.trim();
    }
};
