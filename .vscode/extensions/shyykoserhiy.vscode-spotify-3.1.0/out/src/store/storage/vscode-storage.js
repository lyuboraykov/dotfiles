"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createVscodeStorage(memento) {
    return {
        getItem: (key) => {
            return new Promise((resolve, _reject) => {
                resolve(memento.get(key));
            });
        },
        setItem: (key, item) => {
            return new Promise((resolve, _reject) => {
                memento.update(key, item).then(resolve);
            });
        },
        removeItem: (key) => {
            return new Promise((resolve, _reject) => {
                memento.update(key, null).then(resolve);
            });
        }
    };
}
exports.createVscodeStorage = createVscodeStorage;
function createDummyStorage() {
    return {
        getItem: (_key) => {
            return new Promise((resolve, _reject) => {
                resolve('');
            });
        },
        setItem: (_key, _item) => {
            return new Promise((resolve, _reject) => {
                resolve();
            });
        },
        removeItem: (_key) => {
            return new Promise((resolve, _reject) => {
                resolve();
            });
        }
    };
}
exports.createDummyStorage = createDummyStorage;
//# sourceMappingURL=vscode-storage.js.map