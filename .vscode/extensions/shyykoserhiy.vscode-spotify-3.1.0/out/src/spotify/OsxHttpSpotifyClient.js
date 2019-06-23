"use strict";
/**
 * @deprecated @see https://github.com/ShyykoSerhiy/spotilocal/issues/7#issuecomment-416002808
 */
Object.defineProperty(exports, "__esModule", { value: true });
const OsxSpotifyClient_1 = require("./OsxSpotifyClient");
const OsAgnosticSpotifyClient_1 = require("./OsAgnosticSpotifyClient");
/**
 * Spotify client that uses both applescript(for next, mute, ...) and OsAgnostic(local http client for less CPU usage) approaches.
 */
class OsxHttpSpotifyClient extends OsxSpotifyClient_1.OsxSpotifyClient {
    constructor(spotifyStatus, spotifyStatusController) {
        super(spotifyStatus, spotifyStatusController);
        this.osAgnosticSpotifyClient = new OsAgnosticSpotifyClient_1.OsAgnosticSpotifyClient(spotifyStatusController);
    }
    pollStatus(cb, _getInterval) {
        return this.osAgnosticSpotifyClient.pollStatus(cb, _getInterval);
    }
}
exports.OsxHttpSpotifyClient = OsxHttpSpotifyClient;
//# sourceMappingURL=OsxHttpSpotifyClient.js.map