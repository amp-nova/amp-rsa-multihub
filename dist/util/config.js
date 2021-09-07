const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const branchName = require('current-git-branch');
const nconf = require('nconf');
let args = nconf.argv().env();
// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../../config/settings.yaml`).toString();
// Converting from YAML to JSON
let settings = yaml.load(settingsYAML);
let packageJson = fs.readJSONSync('./package.json');
const isProduction = args.get('app_mode') === 'production';
const port = process.env.PORT || 6393;
module.exports = {
    ...settings,
    packageJson,
    app: {
        mode: isProduction ? 'production' : 'debug',
        host: isProduction ? `https://${args.get('arm_host')}` : `http://localhost:${port}`,
        port
    },
    git: {
        branch: branchName()
    }
};
