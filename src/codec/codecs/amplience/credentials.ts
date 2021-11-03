import _ from 'lodash'
import { CodecConfiguration, CredentialsCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'

const fetch = require('cross-fetch')

export class AmplienceCredentialsCodec extends CredentialsCodec {
    async getCredentials(key: string): Promise<any> {
        let response = await fetch(`https://${this.config.credentials.hubName}.cdn.content.amplience.net/content/key/credentials-${key}?depth=all&format=inlined`)
        let obj = (await response.json()).content
        return obj
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'credentials',

    validate: (config: any) => {
        return config && config.credentials && config.credentials.hubName
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceCredentialsCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)