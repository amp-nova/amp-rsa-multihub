import { ContentItem } from 'dc-management-sdk-js';
export declare class CMSBackend {
    config: any;
    constructor(config: any);
    getContentItems(id: any): Promise<ContentItem>;
    translateContentItem(id: string, locale: string): Promise<any>;
    getSource(): string;
}
