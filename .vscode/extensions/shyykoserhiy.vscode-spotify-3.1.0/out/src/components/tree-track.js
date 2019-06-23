"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const store_1 = require("../store/store");
const actions_1 = require("../actions/actions");
const createTrackTreeItem = (t, playlist, trackIndex) => {
    return new TrackTreeItem(t, vscode.TreeItemCollapsibleState.None, { command: 'spotify.playTrack', title: "Play track", arguments: [trackIndex, playlist] });
};
exports.connectTrackTreeView = (view) => {
    return vscode.Disposable.from(view.onDidChangeSelection((e) => {
        const track = e.selection[0];
        actions_1.actionsCreator.selectTrackAction(track);
    }), view.onDidChangeVisibility((e) => {
        if (e.visible) {
            const state = store_1.getState();
            const { selectedTrack, selectedPlaylist } = state;
            if (selectedTrack && selectedPlaylist) {
                const tracks = state.tracks.get(selectedPlaylist.id);
                const p = tracks && tracks.find((t) => t.track.id === selectedTrack.track.id);
                p && !~view.selection.indexOf(p) && view.reveal(p, { focus: true, select: true });
            }
        }
    }));
};
class TreeTrackProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        store_1.getStore().subscribe(() => {
            const { tracks, selectedPlaylist, selectedTrack } = store_1.getState();
            const newTracks = tracks.get((selectedPlaylist || { id: '' }).id);
            if (this.tracks !== newTracks || this.selectedTrack !== selectedTrack) {
                if (this.selectedTrack !== selectedTrack) {
                    this.selectedTrack = selectedTrack;
                    this.selectedTrack && this.view && this.view.reveal(this.selectedTrack, { focus: true, select: true });
                }
                this.selectedPlaylist = selectedPlaylist;
                this.selectedTrack = selectedTrack;
                this.tracks = newTracks || [];
                this.refresh();
            }
        });
    }
    bindView(view) {
        this.view = view;
    }
    getParent(_t) {
        return void 0; // all tracks are in root
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(t) {
        const { selectedPlaylist, tracks } = this;
        const index = tracks.findIndex((track) => {
            return t.track.id === track.track.id;
        });
        return createTrackTreeItem(t, selectedPlaylist, index);
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
const getArtists = (track) => {
    return track.track.artists.map((a) => a.name).join(', ');
};
class TrackTreeItem extends vscode.TreeItem {
    constructor(track, collapsibleState, command) {
        super(`${getArtists(track)} - ${track.track.name}`, collapsibleState);
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
        return `${getArtists(this.track)} - ${this.track.track.album.name} - ${this.track.track.name}`;
    }
}
//# sourceMappingURL=tree-track.js.map