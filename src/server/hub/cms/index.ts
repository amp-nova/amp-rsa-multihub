import { ContentItem } from 'dc-management-sdk-js'

export class CMSBackend {
    config: any

    constructor(config) {
        this.config = config
    }

    async getContentItems(id): Promise<ContentItem> {
        return null
    }

    async translateContentItem(payload: ContentItem) {
        return null
    }

    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`
    }
}

module.exports = { 
    CMSBackend, 
    backends: {
        amplience: require('./amplience')
    }
}