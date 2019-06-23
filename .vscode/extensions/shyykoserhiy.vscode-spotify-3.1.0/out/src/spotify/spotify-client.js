"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linux_spotify_client_1 = require("./linux-spotify-client");
const osx_spotify_client_1 = require("./osx-spotify-client");
const os = require("os");
const web_api_spotify_client_1 = require("./web-api-spotify-client");
const spotify_config_1 = require("../config/spotify-config");
function isWebApiSpotifyClient() {
    const platform = os.platform();
    return (platform !== 'darwin' && platform !== 'linux') || spotify_config_1.getForceWebApiImplementation();
}
exports.isWebApiSpotifyClient = isWebApiSpotifyClient;
class SpoifyClientSingleton {
    static getSpotifyClient(queryStatus) {
        if (this.spotifyClient) {
            return this.spotifyClient;
        }
        const platform = os.platform();
        if (isWebApiSpotifyClient()) {
            this.spotifyClient = new web_api_spotify_client_1.WebApiSpotifyClient(queryStatus);
            return this.spotifyClient;
        }
        if (platform === 'darwin') {
            this.spotifyClient = new osx_spotify_client_1.OsxSpotifyClient(queryStatus);
        }
        if (platform === 'linux') {
            this.spotifyClient = new linux_spotify_client_1.LinuxSpotifyClient(queryStatus);
        }
        return this.spotifyClient;
    }
}
exports.SpoifyClientSingleton = SpoifyClientSingleton;
exports.CANCELED_REASON = 'canceled';
exports.NOT_RUNNING_REASON = 'not_running';
function createCancelablePromise(executor) {
    let cancel = null;
    const promise = new Promise((resolve, reject) => {
        cancel = () => {
            reject(exports.CANCELED_REASON);
        };
        executor(resolve, reject);
    });
    return { promise, cancel };
}
exports.createCancelablePromise = createCancelablePromise;
//# sourceMappingURL=spotify-client.js.map