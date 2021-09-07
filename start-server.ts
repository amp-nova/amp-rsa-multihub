const npm = require('npm')
const { execAsync } = require('./src/util/helpers')
const logger = require('./src/util/logger')

const run = async () => {
    logger.info(`[ amp-rsa-multihub ] wrapper service starting...`)

    // stash any local changes, we won't need them
    await execAsync('git stash save -u')

    // // do the git checkout
    await execAsync('git pull --ff-only')

    // do the npm install
    await execAsync('npm i')

    let hub = await execAsync('npm run start')
    if (hub.err) {
        logger.error(hub.err)
    }
    else {
        logger.info(`[ amp-rsa-multihub ] exited without error, restarting...`)
        await run()
    }
}
run()