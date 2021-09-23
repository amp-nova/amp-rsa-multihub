"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSBackend = void 0;
class CMSBackend {
    constructor(config) {
        this.config = config;
    }
    async getContentItems(id) {
        return null;
    }
    async translateContentItem(payload) {
        return null;
    }
    getSource() {
        return `${this.config.cred.type}/${this.config.cred.id}`;
    }
}
exports.CMSBackend = CMSBackend;
module.exports = {
    CMSBackend,
    backends: {
        amplience: require('./amplience')
    }
};
