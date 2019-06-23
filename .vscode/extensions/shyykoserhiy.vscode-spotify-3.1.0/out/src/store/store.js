"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const state_1 = require("../state/state");
const root_reducer_1 = require("../reducers/root-reducer");
const redux_persist_1 = require("redux-persist");
const vscode_storage_1 = require("./storage/vscode-storage");
const immutable_1 = require("immutable");
let store;
function getStore(memento) {
    if (!store) {
        const persistConfig = {
            key: 'root',
            storage: memento ? vscode_storage_1.createVscodeStorage(memento) : vscode_storage_1.createDummyStorage(),
            transforms: [{
                    out: (val, key) => {
                        if (key === 'tracks') {
                            return immutable_1.Map(val);
                        }
                        return val;
                    },
                    in: (val, _key) => {
                        return val;
                    }
                }]
        };
        const persistedReducer = redux_persist_1.persistReducer(persistConfig, root_reducer_1.default);
        store = redux_1.createStore(persistedReducer, state_1.getDefaultState());
        redux_persist_1.persistStore(store);
    }
    return store;
}
exports.getStore = getStore;
function getState() {
    return getStore().getState();
}
exports.getState = getState;
/**
 * True if on last state of Spotify it was muted(volume was equal 0)
 */
function isMuted() {
    const state = getState();
    return state && state.playerState.volume === 0;
}
exports.isMuted = isMuted;
//# sourceMappingURL=store.js.map