import _ from 'lodash'
import { CodecConfiguration, ConfigCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'

const fetch = require('cross-fetch')

export class AmplienceConfigCodec extends ConfigCodec {
    async getConfig(): Promise<any> {
        let response = await fetch(`https://${this.config.credentials.hubName}.cdn.content.amplience.net/content/key/environment-${this.config.credentials.environment}?depth=all&format=inlined`)

        let obj = (await response.json()).content
        return {
            algolia: {
                apiKey: obj['algolia:apiKey'],
                appId: obj['algolia:appId'],
                tacit_apiKey: obj['algolia:tacit_apiKey'],
                tacit_appId: obj['algolia:tacit_appId'],
                indexes: {
                    blog: {
                        prod: obj['algolia:indexes:blog:prod'],
                        staging: obj['algolia:indexes:blog:staging']
                    },
                    ruleBased: {
                        prod: obj['algolia:indexes:ruleBased:prod'],
                        staging: obj['algolia:indexes:ruleBased:staging']
                    },
                    productListSearch: {
                        prod: obj['algolia:indexes:productListSearch:prod'],
                        staging: obj['algolia:indexes:productListSearch:staging']
                    }
                }
            },
            analytics: {
                ga: {
                    trackingId: obj['analytics:ga:trackingId'],
                    enabled: obj['analytics:ga:enabled'],
                }
            },
            app: {
                publishStage: obj['app:publishStage'],
                url: obj['app:url']
            },
            commerce: {
                codecKey: obj['commerce:codecKey']                
            },
            cms: {
                contentApi: obj['cms:contentApi'],
                stagingApi: obj['cms:stagingApi'],
                defaultPreviewMode: obj['cms:defaultPreviewMode'],
                hubName: obj['cms:hubName'],
                productImageHubName: obj['cms:productImageHubName'],
                imageBasePath: obj['cms:imageBasePath'],
                contentBaseUri: obj['cms:contentBaseUri'],
                socketIoServer: obj['cms:socketIoServer']
            },
            dynamicyield: {
                apiKey: obj['dynamicyield:apiKey']
            },
            googlemaps: {
                apiKey: obj['googlemaps:apiKey']
            },
            personify: {
                personifyApi: obj['personify:personifyApi']
            },
        } as AMPRSAConfiguration
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'config',

    validate: (config: any) => {
        return config && config.credentials && config.credentials.hubName && config.credentials.environment
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceConfigCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)