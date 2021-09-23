import { CMSBackend } from '..';
import { DynamicContent, ContentItem } from 'dc-management-sdk-js';
export declare type AmplienceTranslationConfig = {
    workflowStates: {
        inProgress: string;
        complete: string;
        sentForTranslation: string;
    };
    contentTypes: {
        schema: string;
        fieldAllowList: string[];
    }[];
};
export declare class AmplienceBackend extends CMSBackend {
    dc: DynamicContent;
    hubName: string;
    constructor(backend: any);
    getContentItem(payload: any): Promise<ContentItem>;
    getTranslationConfig(): Promise<AmplienceTranslationConfig>;
    translateContentItem(payload: ContentItem): Promise<ContentItem>;
    getSource(): string;
}
