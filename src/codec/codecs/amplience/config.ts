import _ from 'lodash'
import { CodecConfiguration, ConfigCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'

const fetch = require('cross-fetch')

export class AmplienceConfigCodec extends ConfigCodec {
    async getConfig(): Promise<any> {
        let response = await fetch(`https://${this.config.credentials.hubName}.cdn.content.amplience.net/content/key/environment-${this.config.credentials.environment}?depth=all&format=inlined`)

        let obj = (await response.json()).content
        let configobj = {
            algolia: {
                apiKey: _.get(obj, 'algolia:apiKey'),
                appId: _.get(obj, 'algolia:appId'),
                tacit_apiKey: _.get(obj, 'algolia:tacit_apiKey'),
                tacit_appId: _.get(obj, 'algolia:tacit_appId'),
                indexes: {
                    blog: {
                        prod: _.get(obj, 'algolia:indexes:blog:prod'),
                        staging: _.get(obj, 'algolia:indexes:blog:staging')
                    },
                    ruleBased: {
                        prod: _.get(obj, 'algolia:indexes:ruleBased:prod'),
                        staging: _.get(obj, 'algolia:indexes:ruleBased:staging')
                    },
                    productListSearch: {
                        prod: _.get(obj, 'algolia:indexes:productListSearch:prod'),
                        staging: _.get(obj, 'algolia:indexes:productListSearch:staging')
                    }
                }
            },
            analytics: {
                ga: {
                    trackingId: _.get(obj, 'analytics:ga:trackingId'),
                    enabled: _.get(obj, 'analytics:ga:enabled'),
                }
            },
            app: {
                publishStage: _.get(obj, 'app:publishStage'),
                url: _.get(obj, 'app:url')
            },
            commerce: {
                codecKey: _.get(obj, 'commerce:codecKey')                
            },
            cms: {
                contentApi: _.get(obj, 'cms:contentApi'),
                stagingApi: _.get(obj, 'cms:stagingApi'),
                defaultPreviewMode: _.get(obj, 'cms:defaultPreviewMode'),
                hubName: _.get(obj, 'cms:hubName'),
                productImageHubName: _.get(obj, 'cms:productImageHubName'),
                imageBasePath: _.get(obj, 'cms:imageBasePath'),
                contentBaseUri: _.get(obj, 'cms:contentBaseUri'),
                socketIoServer: _.get(obj, 'cms:socketIoServer')
            },
            dynamicyield: {
                apiKey: _.get(obj, 'dynamicyield:apiKey')
            },
            googlemaps: {
                apiKey: _.get(obj, 'googlemaps:apiKey')
            },
            personify: {
                personifyApi: _.get(obj, 'personify:personifyApi')
            },
        }

        let config = JSON.parse(JSON.stringify(configobj))
        return config
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