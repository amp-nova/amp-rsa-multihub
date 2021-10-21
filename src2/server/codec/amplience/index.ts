// 3rd party libs
import { CMSClient } from '../../../types'
import _ from 'lodash'
import { CommerceCodec } from '../codec'
import { AmplienceCommerceProductOperation, AmplienceCommerceCategoryOperation, AmplienceFetchOperation } from './operations'

const getFetchBody = array => ({ body: { requests: _.map(_.take(array, 12), key => ({ key })) } })
const mapContent = results => _.map(results.results, 'content')

import { DynamicContent, ContentItem } from 'dc-management-sdk-js'
import { default as translate } from './translation-client'
import { default as logger } from '../../util/logger'

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

export class AmplienceCodec extends CommerceCodec implements CMSClient {
    constructor(config) {
        super(config)
        this.productOperation = new AmplienceCommerceProductOperation(this)
        this.categoryOperation = new AmplienceCommerceCategoryOperation(this)
        this.dc = new DynamicContent({ client_id: this.config.cred.client_id, client_secret: this.config.cred.client_secret })
    }

    async populateCategory(args) {
        let operation = new AmplienceFetchOperation(this)
        let category = await new AmplienceCommerceCategoryOperation(this).get(args)

        if (category.children.length > 0) {
            category.children = mapContent(await operation.get(getFetchBody(category.children)))
        }
        await Promise.all(category.children.map(async cat => {
            if (cat.children.length > 0) {
                cat.children = mapContent(await operation.get(getFetchBody(cat.children)))
            }
        }))

        return category
    }

    async getCategoryHierarchy(args) {
        let categoryKeys = ['women', 'men', 'accessories', 'sale']
        return await Promise.all(categoryKeys.map(key => this.populateCategory({ slug: key })))
    }

    async getCategory(args) {
        return await this.populateCategory(args)
    }

    async getProductsForCategory(category, args) {
        if (category.products.length > 0) {
            return mapContent(await new AmplienceFetchOperation(this).get(getFetchBody(category.products)))
        }
        return []
    }

    dc: DynamicContent
    hubName: string

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

export const Codec = AmplienceCodec
export const canAcceptCredentials = creds => {
    return true
}