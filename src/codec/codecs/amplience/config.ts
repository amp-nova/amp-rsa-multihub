import _ from 'lodash'
import { CodecConfiguration, ConfigCodec, CMSCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'
import { AMPRSAConfiguration } from '../../../types'
import { ContentItem } from 'dc-management-sdk-js'
import { AmplienceCodecConfiguration } from './operations'

const fetch = require('cross-fetch')

export class AmplienceCMSCodec extends CMSCodec {
    async getContentItem(args: any): Promise<ContentItem> {
        let path = args.id && `id/${args.id}` || args.key && `key/${args.key}`
        let response = await fetch(`https://${(this.config as AmplienceCodecConfiguration).hubName}.cdn.content.amplience.net/content/${path}?depth=all&format=inlined`)
        return (await response.json()).content
    }
}

export class AmplienceConfigCodec extends AmplienceCMSCodec {
    async getConfig(): Promise<AMPRSAConfiguration> {
        let obj: any = await this.getContentItem({ key: `aria-env-${(this.config as AmplienceCodecConfiguration).environment}` })
        obj.commerce = await this.getContentItem({ id: obj.commerce.id })
        obj.cms.hubs = _.keyBy(obj.cms.hubs, 'key')
        obj.algolia.credentials = _.keyBy(obj.algolia.credentials, 'key')
        obj.algolia.indexes = _.keyBy(obj.algolia.indexes, 'key')

        // console.log(obj)
        return obj as AMPRSAConfiguration

        // let codecKey = _.get(obj, 'commerce:codecKey')
        // let credentials = await this.getContentItem({ id: _.get(obj, 'commerceCredentials.id') })

        // let configobj = {
        //     algolia: {
        //         apiKey: _.get(obj, 'algolia:apiKey'),
        //         appId: _.get(obj, 'algolia:appId'),
        //         tacit_apiKey: _.get(obj, 'algolia:tacit_apiKey'),
        //         tacit_appId: _.get(obj, 'algolia:tacit_appId'),
        //         indexes: {
        //             blog: {
        //                 prod: _.get(obj, 'algolia:indexes:blog:prod'),
        //                 staging: _.get(obj, 'algolia:indexes:blog:staging')
        //             },
        //             ruleBased: {
        //                 prod: _.get(obj, 'algolia:indexes:ruleBased:prod'),
        //                 staging: _.get(obj, 'algolia:indexes:ruleBased:staging')
        //             },
        //             productListSearch: {
        //                 prod: _.get(obj, 'algolia:indexes:productListSearch:prod'),
        //                 staging: _.get(obj, 'algolia:indexes:productListSearch:staging')
        //             }
        //         }
        //     },
        //     analytics: {
        //         ga: {
        //             trackingId: _.get(obj, 'analytics:ga:trackingId'),
        //             enabled: _.get(obj, 'analytics:ga:enabled'),
        //         }
        //     },
        //     app: {
        //         publishStage: _.get(obj, 'app:publishStage'),
        //         url: _.get(obj, 'app:url')
        //     },
        //     commerce: {
        //         codecKey,
        //         credentials
        //     },
        //     cms: {
        //         contentApi: _.get(obj, 'cms:contentApi'),
        //         stagingApi: _.get(obj, 'cms:stagingApi'),
        //         defaultPreviewMode: _.get(obj, 'cms:defaultPreviewMode'),
        //         hubName: _.get(obj, 'cms:hubName'),
        //         productImageHubName: _.get(obj, 'cms:productImageHubName'),
        //         imageBasePath: _.get(obj, 'cms:imageBasePath'),
        //         contentBaseUri: _.get(obj, 'cms:contentBaseUri'),
        //         socketIoServer: _.get(obj, 'cms:socketIoServer')
        //     },
        //     dynamicyield: {
        //         apiKey: _.get(obj, 'dynamicyield:apiKey')
        //     },
        //     googlemaps: {
        //         apiKey: _.get(obj, 'googlemaps:apiKey')
        //     },
        //     personify: {
        //         personifyApi: _.get(obj, 'personify:personifyApi')
        //     },
        // }

        // let config = JSON.parse(JSON.stringify(configobj))
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'config',

    validate: (config: any) => {
        return config && config.hubName && config.environment
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceConfigCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)