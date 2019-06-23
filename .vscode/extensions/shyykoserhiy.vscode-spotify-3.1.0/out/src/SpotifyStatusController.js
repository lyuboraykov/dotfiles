"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyClient_1 = require("./spotify/SpotifyClient");
const SpotifyConfig_1 = require("./config/SpotifyConfig");
class SpotifyStatusController {
    constructor(spotifyStatus, globalState) {
        this.globalState = globalState;
        this._spotifyStatus = spotifyStatus;
        this._retryCount = 0;
        this._maxRetryCount = 5;
        this.queryStatus();
    }
    scheduleQueryStatus() {
        this._cancelPreviousPoll();
        this._clearQueryTimeout();
        this._timeoutId = setTimeout(() => {
            this.queryStatus();
        }, SpotifyConfig_1.getStatusCheckInterval());
    }
    /**
     * Retrieves status of spotify and passes it to spotifyStatus;
     */
    queryStatus() {
        this._cancelPreviousPoll();
        this._clearQueryTimeout();
        var clearState = (() => {
            this._retryCount++;
            if (this._retryCount >= this._maxRetryCount) {
                this._spotifyStatus.state = {
                    state: { position: 0, volume: 0, state: 'paused' },
                    track: { album: '', artist: '', name: '' },
                    isRepeating: false,
                    isShuffling: false,
                    isRunning: false
                };
                this._retryCount = 0;
            }
            this.scheduleQueryStatus();
        });
        const { promise, cancel } = SpotifyClient_1.SpoifyClientSingleton.getSpotifyClient(this._spotifyStatus, this).pollStatus(status => {
            this._spotifyStatus.state = status;
            this._retryCount = 0;
        }, SpotifyConfig_1.getStatusCheckInterval);
        this._cancelCb = cancel;
        promise.catch(clearState);
    }
    dispose() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
    }
    _clearQueryTimeout() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = void 0;
        }
    }
    _cancelPreviousPoll() {
        this._cancelCb && this._cancelCb();
    }
}
exports.SpotifyStatusController = SpotifyStatusController;
//# sourceMappingURL=SpotifyStatusController.js.map