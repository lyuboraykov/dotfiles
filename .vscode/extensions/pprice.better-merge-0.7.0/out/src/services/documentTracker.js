"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeConflictParser_1 = require("./mergeConflictParser");
const delayer_1 = require("../delayer");
class DocumentMergeConflictTracker {
    constructor() {
        this.cache = new Map();
        this.delayExpireTime = 150;
    }
    getConflicts(document) {
        // Attempt from cache
        let key = this.getCacheKey(document);
        if (!key) {
            // Document doesnt have a uri, can't cache it, so return
            return Promise.resolve(this.getConflictsOrEmpty(document));
        }
        let cacheItem = this.cache.get(key);
        if (!cacheItem) {
            cacheItem = new delayer_1.Delayer(this.delayExpireTime);
            this.cache.set(key, cacheItem);
        }
        return cacheItem.trigger(() => {
            let conflicts = this.getConflictsOrEmpty(document);
            if (this.cache) {
                this.cache.delete(key);
            }
            return conflicts;
        });
    }
    forget(document) {
        let key = this.getCacheKey(document);
        if (key) {
            this.cache.delete(key);
        }
    }
    dispose() {
        if (this.cache) {
            this.cache.clear();
            this.cache = null;
        }
    }
    getConflictsOrEmpty(document) {
        return mergeConflictParser_1.MergeConflictParser.containsConflict(document) ? mergeConflictParser_1.MergeConflictParser.scanDocument(document) : [];
    }
    getCacheKey(document) {
        if (document.uri && document.uri) {
            return document.uri.toString();
        }
        return null;
    }
}
exports.default = DocumentMergeConflictTracker;
//# sourceMappingURL=documentTracker.js.map