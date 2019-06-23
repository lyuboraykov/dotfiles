"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyClient_1 = require("./SpotifyClient");
const spotify = require("spotify-node-applescript");
class OsxSpotifyClient {
    constructor(spotifyStatus, spotifyStatusController) {
        this.spotifyStatus = spotifyStatus;
        this.spotifyStatusController = spotifyStatusController;
        this._queryStatus = this._queryStatus.bind(this);
    }
    next() {
        spotify.next(this._queryStatus);
    }
    previous() {
        spotify.previous(this._queryStatus);
    }
    play() {
        spotify.play(this._queryStatus);
    }
    pause() {
        spotify.pause(this._queryStatus);
    }
    playPause() {
        spotify.playPause(this._queryStatus);
    }
    muteVolume() {
        spotify.muteVolume(this._queryStatus);
    }
    unmuteVolume() {
        spotify.unmuteVolume(this._queryStatus);
    }
    muteUnmuteVolume() {
        if (this.spotifyStatus.isMuted()) {
            spotify.unmuteVolume(this._queryStatus);
        }
        else {
            spotify.muteVolume(this._queryStatus);
        }
        ;
    }
    volumeUp() {
        spotify.volumeUp(this._queryStatus);
    }
    volumeDown() {
        spotify.volumeDown(this._queryStatus);
    }
    toggleRepeating() {
        spotify.toggleRepeating(this._queryStatus);
    }
    toggleShuffling() {
        spotify.toggleShuffling(this._queryStatus);
    }
    getStatus() {
        return this._promiseIsRunning().then((isRunning) => {
            if (!isRunning) {
                return Promise.reject('Spotify isn\'t running');
            }
            return Promise.all([
                this._promiseGetState(),
                this._promiseGetTrack(),
                this._promiseIsRepeating(),
                this._promiseIsShuffling()
            ]).then((values) => {
                const state = {
                    state: values[0],
                    track: values[1],
                    isRepeating: values[2],
                    isShuffling: values[3],
                    isRunning: true
                };
                return state;
            });
        });
    }
    pollStatus(cb, getInterval) {
        let canceled = false;
        const p = SpotifyClient_1.createCancelablePromise((_, reject) => {
            const _poll = () => {
                if (canceled) {
                    return;
                }
                this.getStatus().then(status => {
                    cb(status);
                    setTimeout(() => _poll(), getInterval());
                }).catch(reject);
            };
            _poll();
        });
        p.promise = p.promise.catch((err) => {
            canceled = true;
            throw err;
        });
        return p;
    }
    _queryStatus() {
        this.spotifyStatusController.queryStatus();
    }
    _promiseIsRunning() {
        return new Promise((resolve, reject) => {
            spotify.isRunning((err, isRunning) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(isRunning);
                }
            });
        });
    }
    _promiseGetState() {
        return new Promise((resolve, reject) => {
            spotify.getState((err, state) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(state);
                }
            });
        });
    }
    _promiseGetTrack() {
        return new Promise((resolve, reject) => {
            spotify.getTrack((err, track) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(track);
                }
            });
        });
    }
    _promiseIsRepeating() {
        return new Promise((resolve, reject) => {
            spotify.isRepeating((err, repeating) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(repeating);
                }
            });
        });
    }
    _promiseIsShuffling() {
        return new Promise((resolve, reject) => {
            spotify.isShuffling((err, shuffling) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(shuffling);
                }
            });
        });
    }
}
exports.OsxSpotifyClient = OsxSpotifyClient;
//# sourceMappingURL=OsxSpotifyClient.js.map