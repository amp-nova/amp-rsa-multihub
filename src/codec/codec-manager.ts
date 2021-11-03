import _ from 'lodash'
import { Codec } from './codec'
import { CMSCodec, CommerceCodec, ConfigCodec, CredentialsCodec } from '..';

const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
let secretManager = new SecretsManager()

export class CodecType {
    vendor: string
    codecType: string
    validate: (config: any) => boolean
    create: (config: any) => Codec
}

export class CodecManager {
    codecTypes: {} = {}
    credentialLookupStrategy: (key: string) => any = __ => {}

    registerCodecType(codecType: CodecType) {
        let key: string = `${codecType.vendor}-${codecType.codecType}`
        let existing: CodecType = this.codecTypes[key]
        if (!existing) {
            console.log(`[ aria ] register codec [ ${key} ]`)
            this.codecTypes[key] = codecType
        }
    }
    
    async getCommerceCodec(codecKey: string | any): Promise<CommerceCodec> {
        return await this.getCodec(codecKey, "commerce") as CommerceCodec
    }

    async getCMSCodec(codecKey: string | any): Promise<CMSCodec> {
        return await this.getCodec(codecKey, "cms") as CMSCodec
    }

    async getConfigCodec(codecKey: string | any): Promise<ConfigCodec> {
        return await this.getCodec(codecKey, "config") as ConfigCodec
    }

    async getCredentialsCodec(codecKey: string | any): Promise<CredentialsCodec> {
        return await this.getCodec(codecKey, "credentials") as CredentialsCodec
    }

    async getCodec(codecKey: string | any, codecType: string): Promise<Codec> {
        let credentials: any = codecKey

        if (typeof codecKey === 'string') {
            credentials = await this.credentialLookupStrategy(codecKey)
            if (!credentials) {
                throw `[ aria ] no credentials found for codec key [ ${codecKey} ]`
            }    
        }
        else if (typeof codecKey === 'object') {
            codecKey = 'none'
        }
    
        let [vendor, key] = codecKey.split('/')
        let codecs: CodecType[] = _.filter(Object.values(this.codecTypes), (c: CodecType) => codecType === c.codecType && (codecKey === 'none' || c.vendor === vendor) && c.validate({ codecKey, credentials }))
        if (_.isEmpty(codecs)) {
            throw `[ aria ] no codecs found matching [ ${ codecKey === 'none' ? JSON.stringify(credentials) : codecKey } ]`
        }
        else if (codecs.length > 1) {
            throw `[ aria ] multiple codecs found for key [ ${codecKey} ], must specify vendor in request`
        }

        return codecs[0].create({ codecKey, credentials })
    }    
}

export const awsSecretManagerLookupStrategy = async (codecKey: string): Promise<any> => {
    try {
        let secret = await secretManager.getSecretValue({ SecretId: codecKey })
        return JSON.parse(secret.SecretString)
    } catch (error) {
        throw `[ aria ] s3LookupStrategy: error retrieving secret: ${error}`
    }
}

// create the codec manager and register types we know about
export const codecManager = new CodecManager()

import './codecs'
import { CredentialsClient } from '@/types';
