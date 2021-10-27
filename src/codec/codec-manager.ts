import _ from 'lodash'
import { Codec } from './codec'

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
let secretManager = new SecretsManager()

export class CodecType {
    key: string
    validate: (config: any) => boolean
    create: (config: any) => Codec
}

export class CodecManager {
    codecTypes: CodecType[] = []

    registerCodecType(codecType: CodecType) {
        let existing: CodecType = _.find(this.codecTypes, type => codecType.key === type.key)
        if (!existing) {
            console.log(`[ aria ] registering codec with key [ ${codecType.key} ]`)
            this.codecTypes.push(codecType)
        }
    }
    
    async getCodec(codecKey: string) {
        let credentials: any = await lookupStrategy(codecKey)
        if (!credentials) {
            throw `[ aria ] no credentials found for codec key [ ${codecKey} ]`
        }
    
        let codecType: CodecType = _.find(this.codecTypes, (c: CodecType) => c.validate({ codecKey, credentials }))
        if (!codecType) {
            throw `[ aria ] no codecs found matching key [ ${codecKey} ]`
        }
    
        return codecType.create({ codecKey, credentials })
    }    
}

export const s3LookupStrategy = async (codecKey: string): Promise<any> => {
    try {
        let secret = await secretManager.getSecretValue({ SecretId: codecKey })
        let cred = JSON.parse(secret.SecretString)
        return cred
    } catch (error) {
        throw `Error retrieving secret: ${error}`
    }
}

export const jsonFileLookupStrategy = async (codecKey: string): Promise<any> => {
    if (codecKey === 'commercetools/anyafinn') {
        return {
            client_id: 'obUOGoEtePZjlB84IWEv-9IE',
            client_secret: 'Xj_A2Rwbkjg1PhlsHM0z-wxRTh5emfHk',
            oauth_url: 'https://auth.europe-west1.gcp.commercetools.com',
            api_url: 'https://api.europe-west1.gcp.commercetools.com',
            project: 'anyafinn',
            scope: 'manage_project:anyafinn'
        }
    }
    else if (codecKey === 'files') {
        return {
            products: 'data/all_products.json',
            categories: 'data/all_categories.json'
        }
    }
}

const lookupStrategy = jsonFileLookupStrategy

// create the codec manager and register types we know about
export const codecManager = new CodecManager()

import './codecs'