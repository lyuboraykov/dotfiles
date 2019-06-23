import { Device, Playlist, Track, User, Player } from "./consts";
import fetch, { RequestInit } from 'node-fetch';
import { URLSearchParams } from 'url';

export const apiUrl = 'https://api.spotify.com/v1/';
export const GET = { 'method': 'GET' }
export const POST = { 'method': 'POST' };
export const PUT = { 'method': 'PUT' };

const getHeaders = (token: string) => {
    return {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8",
        }
    }
}

const queryParamsHelper = (url: string, queryPrams?: { [key: string]: string | boolean | number | undefined }) => {
    const sP = queryPrams && Object.keys(queryPrams).reduce((searchParams, key) => {
        const v = queryPrams[key];
        if (v != null) {
            searchParams.set(key, v + '');
        }
        return searchParams;
    }, new URLSearchParams()).toString();
    return sP ? `${url}?${sP}` : url;
}

export const getApi = (spotifyAuthServer: string, token: string, refreshToken: string, onTokenRefreshed?: (token: string) => void) => {
    let headers = getHeaders(token);

    const refreshTokenFunc = async () => {
        const searchParams = new URLSearchParams();
        searchParams.set('refresh_token', refreshToken);
        const response = await fetch(`${spotifyAuthServer}/refresh_token?${searchParams.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to refresh token: ${await response.text()}`);
        }
        return ((await response.json()) as { 'access_token': string }).access_token;
    };

    const makeRequest = async <T>(urlPart: string, options: RequestInit, retry = false): Promise<T> => {
        const response = await fetch(`${apiUrl}${urlPart}`, options);
        if (response.ok) {
            if (response.status === 204) {
                return undefined as any;
            }
            return response.json() as Promise<T>
        }

        if (response.status === 401) {
            if (!retry) {
                // try to refresh token
                token = await refreshTokenFunc();
                onTokenRefreshed && onTokenRefreshed(token);
                headers = getHeaders(token);
                return makeRequest(urlPart, { ...options, ...headers }, true) as Promise<T>;
            } else {
                throw new Error('Invalid token: ' + await response.text());
            }
        }

        throw new Error('Unknown error: status code' + response.status + ' ; ' + await response.text());
    }
    return {
        me: {
            get: async () => {
                return makeRequest<User>('me', {
                    ...GET, ...headers
                });
            }
        },
        player: {
            get: async () => {
                return makeRequest<Player>('me/player', {
                    ...GET, ...headers
                });
            },
            devices: {
                get: async () => {
                    return makeRequest<{ devices: Device[] }>('me/player/devices', {
                        ...GET, ...headers
                    });
                }
            },
            play: {
                put: async (params: { trackUri?: string, offset?: number, albumUri?: string, deviceId?: string }) => {
                    const { trackUri, albumUri, deviceId, offset } = params;
                    const body = JSON.stringify({
                        ...(trackUri ? { "uris": [trackUri] } : {}),
                        ...(albumUri ? { "context_uri": albumUri } : {}),
                        ...(offset !== void 0 ? { "offset": { "position": offset } } : {})
                    });
                    return makeRequest<void>(queryParamsHelper(`me/player/play`, { 'device_id': deviceId }), {
                        body, ...PUT, ...headers
                    });
                }
            },
            pause: {
                put: async (deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/pause`, { 'device_id': deviceId }), {
                        ...PUT, ...headers
                    });
                }
            },
            previous: {
                post: async (deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/previous`, { 'device_id': deviceId }), {
                        ...POST, ...headers
                    });
                }
            },
            next: {
                post: async (deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/next`, { 'device_id': deviceId }), {
                        ...POST, ...headers
                    });
                }
            },
            shuffle: {
                put: async (state: boolean, deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/shuffle`, { state, 'device_id': deviceId }), {
                        ...PUT, ...headers
                    });
                }
            },
            repeat: {
                put: async (state: "track" | "context" | "off", deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/repeat`, { state, 'device_id': deviceId }), {
                        ...PUT, ...headers
                    });
                }
            },
            volume: {
                put: async (volumePersent: number, deviceId?: string) => {
                    return makeRequest<void>(queryParamsHelper(`me/player/volume`, { 'volume_percent': volumePersent, 'device_id': deviceId }), {
                        ...PUT, ...headers
                    });
                }
            }
        },
        playlists: {
            get: async (options?: { fields?: string, limit?: number, offset?: number }) => {
                const opt = { limit: 50, offset: 0, ...options };
                return makeRequest<{ items: Playlist[], total: number }>(queryParamsHelper('me/playlists', opt), {
                    ...GET, ...headers
                });
            },
            async getAll() {
                let tracks = [] as Playlist[];
                const limit = 50;
                let getOperations = 1;
                let i = 0;
                let offset = 0;
                while (i < getOperations) {
                    const res = await this.get({ limit, offset });
                    i++;
                    offset += limit;
                    getOperations = Math.ceil(res.total / limit);
                    tracks = tracks.concat(res.items);
                }

                return tracks;
            },
            tracks: {
                get: async (playlist: Playlist, options?: { fields?: string, limit?: number, offset?: number }) => {
                    const opt = { fields: 'items(track(id,name,uri,album(id,name),artists(id,name))),limit,offset,total', limit: 100, offset: 0, ...options };
                    const userId = playlist.owner.id;
                    const playlistId = playlist.id
                    return await makeRequest<{ items: Track[], limit: number, offset: number, total: number }>(queryParamsHelper(`users/${userId}/playlists/${playlistId}/tracks`, opt), {
                        ...GET, ...headers
                    });
                },
                async getAll(playlist: Playlist) {
                    let tracks = [] as Track[];
                    const limit = 100;
                    let getOperations = 1;
                    let i = 0;
                    let offset = 0;
                    while (i < getOperations) {
                        const res = await this.get(playlist, { limit, offset });
                        i++;
                        offset += limit;
                        getOperations = Math.ceil(res.total / limit);
                        tracks = tracks.concat(res.items);
                    }

                    return tracks;
                }
            }
        }
    }
};

const tempAPI = getApi('', '', '');
export type Api = typeof tempAPI;