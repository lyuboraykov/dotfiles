"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const SpotifyControls_1 = require("./SpotifyControls");
const SpotifyConfig_1 = require("./config/SpotifyConfig");
class SpotifyStatus {
    /**
     * Sets state of spotify. Trigers 'updateSpotifyStatus' method.
     */
    set state(state) {
        this._state = state;
        this.updateSpotifyStatus();
    }
    get state() {
        return this._state;
    }
    /**
     * Updates spotify status bar inside vscode
     */
    updateSpotifyStatus() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, SpotifyConfig_1.getButtonPriority('trackInfo'));
            this._statusBarItem.show();
        }
        if (!this._spotifyControls) {
            this._spotifyControls = new SpotifyControls_1.SpotifyControls();
            this._spotifyControls.showVisible();
        }
        if (this._state.isRunning) {
            const { isRepeating, isShuffling } = this._state;
            const { state: playing, volume } = this._state.state;
            var text = _formattedTrackInfo(this._state.track);
            if (text !== this._statusBarItem.text) { //we need this guard to prevent flickering
                this._statusBarItem.text = text;
                this.redraw(); //we need to redraw due to a bug with priority
            }
            if (this._spotifyControls.updateDynamicButtons(playing === 'playing', volume === 0, isRepeating, isShuffling)) {
                this.redraw(); //we need to redraw due to a bug with priority
            }
            if (this._hidden) {
                this.redraw();
            }
        }
        else {
            this.redraw();
        }
    }
    redraw() {
        if (this._state.isRunning) {
            this._statusBarItem.show();
            this._spotifyControls.showVisible();
            this._hidden = false;
        }
        else {
            this._statusBarItem.hide();
            this._spotifyControls.hideAll();
            this._hidden = true;
        }
    }
    /**
     * True if on last state of Spotify it was muted(volume was equal 0)
     */
    isMuted() {
        return this.state && this.state.state.volume === 0;
    }
    /**
     * Disposes status bar items(if exist)
     */
    dispose() {
        if (this._statusBarItem) {
            this._statusBarItem.dispose();
        }
        if (this._spotifyControls) {
            this._spotifyControls;
        }
    }
}
exports.SpotifyStatus = SpotifyStatus;
function _formattedTrackInfo(track) {
    const { album, artist, name } = track;
    const keywordsMap = {
        albumName: album,
        artistName: artist,
        trackName: name,
    };
    let a = SpotifyConfig_1.getTrackInfoFormat().replace(/albumName|artistName|trackName/gi, matched => {
        return keywordsMap[matched];
    });
    return a;
}
//# sourceMappingURL=SpotifyStatus.js.map