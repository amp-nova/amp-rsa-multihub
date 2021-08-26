const npm = require('npm')
const { execAsync } = require('./src/util/helpers')

const run = async () => {
    console.info(`[ amp-rsa-multihub ] wrapper service starting...`)

    // do the git checkout
    await execAsync('git pull --ff-only')

    // do the npm install
    await execAsync('npm i')

    // npm.load(() => {
    //     npm.commands.run(['start'], x => {
    //         console.log(x)
    //         console.log(`multihub exited.  see ya on the flip side!`)
    //     })
    // })

    let hub = await execAsync('npm run start')
    if (hub.err) {
        console.log(hub.err)
    }
    else {
        console.info(`[ amp-rsa-multihub ] exited without error, restarting...`)
        await run()
    }
}
run()