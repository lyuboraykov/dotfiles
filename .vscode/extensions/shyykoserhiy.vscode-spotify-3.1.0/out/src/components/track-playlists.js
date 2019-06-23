"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const store_1 = require("../store/store");
//import { actionsCreator } from '../actions/actions';
const createTrackTreeItem = (p) => {
    return new TrackTreeItem(p, vscode.TreeItemCollapsibleState.None);
};
exports.connectTrackTreeView = (view) => {
    return vscode.Disposable.from(
    /*view.onDidChangeSelection((e) => {
        actionsCreator.selectPlaylistAction(e.selection[0]);
        actionsCreator.loadTracksIfNotLoaded(e.selection[0]);
    }),
    view.onDidChangeVisibility((e) => {
        if (e.visible) {
            const state = getState();
            if (state.selectedPlaylist) {
                const p = state.playlists.find((pl) => pl.id === state.selectedPlaylist!.id);
                p && !~view.selection.indexOf(p) && view.reveal(p, { focus: true, select: true });
            }
        }
    })*/
    );
};
class TreeTrackProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        store_1.getStore().subscribe(() => {
            const { tracks, selectedPlaylist } = store_1.getState();
            const newTracks = tracks.get((selectedPlaylist || { id: '' }).id);
            if (this.tracks !== newTracks) {
                this.tracks = newTracks || [];
                this.refresh();
            }
        });
    }
    getParent(t) {
        return void 0; // all tracks are in root
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(p) {
        return createTrackTreeItem(p);
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
            ;
        }
        if (!this.tracks) {
            return Promise.resolve([]);
        }
        return new Promise(resolve => {
            resolve(this.tracks);
        });
    }
}
exports.TreeTrackProvider = TreeTrackProvider;
class TrackTreeItem extends vscode.TreeItem {
    constructor(track, collapsibleState, command) {
        super(`${track.track.artists} - ${track.track.name}`, collapsibleState);
        this.track = track;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'track.svg'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'track.svg')
        };
        this.contextValue = 'track';
    }
    get tooltip() {
        return `${this.track.track.artists} - ${this.track.track.album} - ${this.track.track.name}`;
    }
}
//# sourceMappingURL=track-playlists.js.map