"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplienceBackend = void 0;
const __1 = require("..");
const dc_management_sdk_js_1 = require("dc-management-sdk-js");
const translation_client_1 = __importDefault(require("./translation-client"));
const logger_1 = __importDefault(require("@/server/util/logger"));
const axios = require('axios');
const fetch = require('node-fetch');
const jsonpath = require('jsonpath');
const updateStatus = async (contentItem, state) => {
    logger_1.default.info(`[ cms ] updateStatus on content item [ ${contentItem.id} ] to [ ${state} ]`);
    return contentItem.updateLinkedResource('edit-workflow', {}, { state, version: contentItem.version }, dc_management_sdk_js_1.ContentItem);
};
const doTranslateContentItem = async (contentItem, locale, config) => {
    const contentTypeConfig = config.contentTypes.find(x => x.schema === contentItem.body._meta.schema);
    if (!contentTypeConfig) {
        logger_1.default.info(`skipping ${contentItem.id}, content type not configured for translation`);
        return contentItem;
    }
    let [language, __] = locale.split('-');
    await Promise.all(config.contentTypes.map(async (contentType) => {
        await Promise.all(contentType.fieldAllowList.map(async (field) => {
            jsonpath.value(contentItem.body, field, await translation_client_1.default(jsonpath.value(contentItem.body, field), language));
        }));
    }));
    return contentItem.related.update(contentItem);
};
class AmplienceBackend extends __1.CMSBackend {
    constructor(backend) {
        console.log(backend);
        super(backend);
        this.dc = new dc_management_sdk_js_1.DynamicContent({ client_id: this.config.cred.client_id, client_secret: this.config.cred.client_secret });
    }
    async getContentItem(payload) {
        console.log(`getContentItems`);
        let item = await this.dc.contentItems.get(payload.payload.id);
        console.log(`content items: ${JSON.stringify(item)}`);
        return item;
        // let contentItem = await axios.get(`https://${this.config.cred.id}.cdn.content.amplience.net/content/id/${payload.payload.id}`, {
        //     headers: { 'Authorization': await this.authenticate() }
        // })
        // console.log(`contentItem!`)
        // console.log(contentItem)
        // return payload
    }
    async getTranslationConfig() {
        console.log(`getTranslationConfig`);
        let response = await fetch(`https://${this.config.cred.id}.cdn.content.amplience.net/content/key/config/translation?depth=all&format=inlined`);
        return (await response.json()).content;
    }
    async translateContentItem(payload) {
        let translationConfig = await this.getTranslationConfig();
        let contentItem = await this.getContentItem(payload);
        if (contentItem.workflow.state !== translationConfig.workflowStates.inProgress) {
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.inProgress);
            contentItem = await doTranslateContentItem(contentItem, contentItem.locale, translationConfig);
            contentItem = await updateStatus(contentItem, translationConfig.workflowStates.complete);
        }
        return contentItem;
    }
    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`;
    }
}
exports.AmplienceBackend = AmplienceBackend;
module.exports = AmplienceBackend;
