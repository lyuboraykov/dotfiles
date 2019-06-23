"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../state/state");
const actions_1 = require("../actions/actions");
const info_1 = require("../info/info");
function update(obj, update) {
    return Object.assign({}, obj, update);
}
exports.update = update;
function default_1(state, action) {
    info_1.log('root-reducer', action.type, JSON.stringify(action));
    if (action.type === actions_1.UPDATE_STATE_ACTION) {
        return update(state, action.state);
    }
    if (action.type === actions_1.SIGN_IN_ACTION) {
        return update(state, {
            loginState: update(state.loginState, { accessToken: action.accessToken, refreshToken: action.refreshToken })
        });
    }
    if (action.type === actions_1.SIGN_OUT_ACTION) {
        return state_1.getDefaultState();
    }
    if (action.type === actions_1.PLAYLISTS_LOAD_ACTION) {
        return update(state, {
            playlists: (action.playlists && action.playlists.length) ? action.playlists : [state_1.DUMMY_PLAYLIST]
        });
    }
    if (action.type === actions_1.SELECT_PLAYLIST_ACTION) {
        return update(state, {
            selectedPlaylist: action.playlist
        });
    }
    if (action.type === actions_1.SELECT_TRACK_ACTION) {
        return update(state, {
            selectedTrack: action.track
        });
    }
    if (action.type === actions_1.TRACKS_LOAD_ACTION) {
        return update(state, {
            tracks: state.tracks.set(action.playlist.id, action.tracks)
        });
    }
    return state;
}
exports.default = default_1;
//# sourceMappingURL=root-reducer.js.map