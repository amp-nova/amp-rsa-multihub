const npm = require('npm')
const { execAsync } = require('./src/util/helpers')

const run = async () => {
    // do the git checkout
    await execAsync('git pull --ff-only')

    // do the npm install
    await execAsync('npm i')

    npm.load(() => {
        npm.commands.run(['start'], () => {
            console.log(`multihub exited.  see ya on the flip side!`)
        })
    })
}
run()