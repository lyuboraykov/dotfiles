"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const store_1 = require("../store/store");
const actions_1 = require("../actions/actions");
const createPlaylistTreeItem = (p) => {
    return new PlaylistTreeItem(p, vscode.TreeItemCollapsibleState.None);
};
exports.connectPlaylistTreeView = (view) => {
    return vscode.Disposable.from(view.onDidChangeSelection((e) => {
        actions_1.actionsCreator.selectPlaylistAction(e.selection[0]);
        actions_1.actionsCreator.loadTracksIfNotLoaded(e.selection[0]);
    }), view.onDidChangeVisibility((e) => {
        if (e.visible) {
            const state = store_1.getState();
            if (!state.playlists.length) {
                actions_1.actionsCreator.loadPlaylists();
            }
            if (state.selectedPlaylist) {
                const p = state.playlists.find((pl) => pl.id === state.selectedPlaylist.id);
                p && !~view.selection.indexOf(p) && view.reveal(p, { focus: true, select: true });
            }
        }
    }));
};
class TreePlaylistProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        store_1.getStore().subscribe(() => {
            const { playlists } = store_1.getState();
            if (this.playlists !== playlists) {
                this.playlists = playlists;
                this.refresh();
            }
        });
    }
    getParent(_p) {
        return void 0; // all playlists are in root
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(p) {
        return createPlaylistTreeItem(p);
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
            ;
        }
        if (!this.playlists) {
            return Promise.resolve([]);
        }
        return new Promise(resolve => {
            resolve(this.playlists);
        });
    }
}
exports.TreePlaylistProvider = TreePlaylistProvider;
class PlaylistTreeItem extends vscode.TreeItem {
    constructor(playlist, collapsibleState, command) {
        super(playlist.name, collapsibleState);
        this.playlist = playlist;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'playlist.svg'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'playlist.svg')
        };
        this.contextValue = 'playlist';
    }
    get tooltip() {
        return `${this.playlist.id}:${this.label}`;
    }
}
//# sourceMappingURL=tree-playlists.js.map