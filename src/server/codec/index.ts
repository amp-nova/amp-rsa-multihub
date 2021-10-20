const _ = require('lodash')

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

// note: if config.codec is undefined, credentials need to be available elsewhere.
let secretManager = new SecretsManager()

let codecs = []

if (typeof window === 'undefined') {
  // const fs = require('fs-extra')

  // // this is a clusterfuck and needs to be fixed.
  // // something like let codecs = _.map(dirs...) or i don't know.
  // let files = fs.readdirSync('src/server/codec')
  // _.each(files, file => {
  //   let stat = fs.statSync(`src/server/codec/${file}`)
  //   if (stat.isDirectory()) {
  //     let x = require(`./${file}`)
  //     codecs.push(x)
  //   }
  // })
}

export const registerCodec = codec => {
  console.log(`register: ${JSON.stringify(codec)}`)
  codecs.push(codec)
}

export const getCodec = async context => {
  console.log(`[ pbx ] codecs registered: ${codecs.length}`)

  if (_.isEmpty(context.codecKey)) {
    throw `x-pbx-codec-key not set`
  }

  try {
    let secret = await secretManager.getSecretValue({ SecretId: context.codecKey })
    let cred = JSON.parse(secret.SecretString)
    if (cred) {
      let [type, key] = context.codecKey.split('/')
      let codecType = _.find(codecs, c => {
        console.log(`codec: ${c}`)
        console.log(`cred: ${JSON.stringify(cred)}`)
        return c.canAcceptCredentials(cred)
      })
      if (codecType) {
        return new codecType.Codec({ cred, context, type, key })
      }
      else {
        console.error(`No codec was able to accept the credentials presented`)
      }
    }
    else {
      console.error(`No pbx codec matches key [ ${context.codecKey} ]. Please make sure you have set the 'x-pbx-codec-key' header.`)
    }
  } catch (error) {
    throw `Error retrieving secret: ${error}`
  }
}