import { CMSBackend } from '..'
import { DynamicContent, ContentItem } from 'dc-management-sdk-js'
import { default as translate } from './translation-client'
import { default as logger } from '@/util/logger'

const fetch = require('node-fetch')
const jsonpath = require('jsonpath')

export type AmplienceTranslationConfig = {
    workflowStates: {
        inProgress: string;
        complete: string;
    },
    contentTypes: {
        schema: string;
        fieldAllowList: string[];
    }[];
};

const updateStatus = async(contentItem: ContentItem, state: string): Promise<ContentItem> => {
    return (contentItem as any).updateLinkedResource(
        'edit-workflow', 
        {}, 
        { state, version: contentItem.version }, 
        ContentItem
    );
}

const doTranslateContentItem = async(contentItem: ContentItem, locale: string, config: AmplienceTranslationConfig): Promise<ContentItem> => {
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

    constructor(backend) {
        super(backend)
        this.dc = new DynamicContent(backend.cred)
    }

    async getContentItems(id) {
        return await this.dc.contentItems.get(id)
    }

    async getTranslationConfig() {
        let response = await fetch(`https://${this.config.cred.id}.cdn.content.amplience.net/content/key/config/translation?depth=all&format=inlined`)
        return (await response.json()).content as AmplienceTranslationConfig
    }

    async translateContentItem(id: string, locale: string) {
        let translationConfig: AmplienceTranslationConfig = await this.getTranslationConfig()
        let contentItem: ContentItem = await this.getContentItems(id)
    
        if (contentItem.workflow.state !== translationConfig.workflowStates.inProgress) {
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.inProgress)
            contentItem = await doTranslateContentItem(contentItem, locale, translationConfig)
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.complete)
        }

        return contentItem
    }

    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`
    }
}

module.exports = AmplienceBackend