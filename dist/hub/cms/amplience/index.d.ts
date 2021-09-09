import { CMSBackend } from '..';
import { DynamicContent, ContentItem } from 'dc-management-sdk-js';
export declare type AmplienceTranslationConfig = {
    workflowStates: {
        inProgress: string;
        complete: string;
    };
    contentTypes: {
        schema: string;
        fieldAllowList: string[];
    }[];
};
export declare class AmplienceBackend extends CMSBackend {
    dc: DynamicContent;
    constructor(backend: any);
    getContentItems(id: any): Promise<ContentItem>;
    getTranslationConfig(): Promise<AmplienceTranslationConfig>;
    translateContentItem(id: string, locale: string): Promise<ContentItem>;
    getSource(): string;
}
