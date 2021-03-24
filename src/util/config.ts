const { readFileSync } = require('fs')
const yaml = require('js-yaml');

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();

// Converting from YAML to JSON
module.exports = yaml.load(settingsYAML)