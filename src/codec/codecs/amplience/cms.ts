import _ from 'lodash'
import { CodecConfiguration, CMSCodec } from '../../codec'
import { CodecType, codecManager } from '../../codec-manager'

import { DynamicContent, ContentItem } from 'dc-management-sdk-js'
import { default as translate } from './translation-client'
import { AmplienceDCCodecConfiguration } from './operations'

const fetch = require('cross-fetch')
const jsonpath = require('jsonpath')

export type AmplienceTranslationConfig = {
    workflowStates: {
        inProgress: string;
        complete: string;
        sentForTranslation: string;
    },
    contentTypes: {
        schema: string;
        fieldAllowList: string[];
    }[];
};

const updateStatus = async (contentItem: ContentItem, state: string): Promise<ContentItem> => {
    console.info(`[ cms ] updateStatus on content item [ ${contentItem.id} ] to [ ${state} ]`)
    return (contentItem as any).updateLinkedResource(
        'edit-workflow',
        {},
        { state, version: contentItem.version },
        ContentItem
    );
}

const doTranslateContentItem = async (contentItem: ContentItem, locale: string, config: AmplienceTranslationConfig): Promise<ContentItem> => {
    const contentTypeConfig = config.contentTypes.find(x => x.schema === contentItem.body._meta.schema);
    if (!contentTypeConfig) {
        console.info(`skipping ${contentItem.id}, content type not configured for translation`);
        return contentItem;
    }

    let [language, __] = locale.split('-')
    await Promise.all(config.contentTypes.map(async contentType => {
        await Promise.all(contentType.fieldAllowList.map(async field => {
            jsonpath.value(contentItem.body, field, await translate(jsonpath.value(contentItem.body, field), language))
        }))
    }))

    return contentItem.related.update(contentItem);
}

export class AmplienceDCCMSCodec extends CMSCodec {
    dc: DynamicContent

    constructor(config: CodecConfiguration) {
        super(config)
        let c: AmplienceDCCodecConfiguration = (this.config as AmplienceDCCodecConfiguration)
        this.dc = new DynamicContent({ client_id: c.client_id, client_secret: c.client_secret })
    }

    async getContentItem(payload): Promise<ContentItem> {
        return await this.dc.contentItems.get(payload.payload.id)
    }

    async getTranslationConfig() {
        let response = await fetch(`https://${this.config.key}.cdn.content.amplience.net/content/key/config/translation?depth=all&format=inlined`)
        return (await response.json()).content as AmplienceTranslationConfig
    }

    async translateContentItem(payload: ContentItem) {
        let translationConfig: AmplienceTranslationConfig = await this.getTranslationConfig()
        let contentItem: ContentItem = await this.getContentItem(payload)

        if (contentItem.workflow.state !== translationConfig.workflowStates.inProgress) {
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.inProgress)
            contentItem = await doTranslateContentItem(contentItem, contentItem.locale, translationConfig)
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.complete)
        }
        return contentItem
    }
}

const type: CodecType = {
    vendor: 'amplience',
    codecType: 'cms',

    validate: (config: any) => {
        return config && 
            config.client_id &&
            config.client_secret
    },

    create: (config: CodecConfiguration) => {
        return new AmplienceDCCMSCodec(config)
    }
}
export default type

// register myself with codecManager
codecManager.registerCodecType(type)