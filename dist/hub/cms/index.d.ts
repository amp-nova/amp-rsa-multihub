import { ContentItem } from 'dc-management-sdk-js';
export declare class CMSBackend {
    config: any;
    constructor(config: any);
    getContentItems(id: any): Promise<ContentItem>;
    translateContentItem(payload: ContentItem): Promise<any>;
    getSource(): string;
}
