import { CMSBackend } from '..'
import { DynamicContent, ContentItem } from 'dc-management-sdk-js'
import { default as translate } from './translation-client'
import { default as logger } from '@/server/util/logger'

const axios = require('axios')
const fetch = require('node-fetch')
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
    logger.info(`[ cms ] updateStatus on content item [ ${contentItem.id} ] to [ ${state} ]`)
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
        logger.info(`skipping ${contentItem.id}, content type not configured for translation`);
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

export class AmplienceBackend extends CMSBackend {
    dc: DynamicContent
    hubName: string

    constructor(backend) {
        console.log(backend)

        super(backend)
        this.dc = new DynamicContent({ client_id: this.config.cred.client_id, client_secret: this.config.cred.client_secret })
    }

    async getContentItem(payload): Promise<ContentItem> {
        console.log(`getContentItems`)

        let item = await this.dc.contentItems.get(payload.payload.id)
        console.log(`content items: ${JSON.stringify(item)}`)
        return item 

        // let contentItem = await axios.get(`https://${this.config.cred.id}.cdn.content.amplience.net/content/id/${payload.payload.id}`, {
        //     headers: { 'Authorization': await this.authenticate() }
        // })

        // console.log(`contentItem!`)

        // console.log(contentItem)

        // return payload
    }

    async getTranslationConfig() {
        console.log(`getTranslationConfig`)
        let response = await fetch(`https://${this.config.cred.id}.cdn.content.amplience.net/content/key/config/translation?depth=all&format=inlined`)
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

    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`
    }
}

module.exports = AmplienceBackend