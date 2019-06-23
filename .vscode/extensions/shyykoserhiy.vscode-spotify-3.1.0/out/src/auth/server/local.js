"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const spotify_config_1 = require("../../config/spotify-config");
const info_1 = require("../../info/info");
exports.createDisposableAuthSever = () => {
    let server;
    const createServerPromise = new Promise((res, rej) => {
        setTimeout(() => {
            rej('Timeout error. No response for 10 minutes.');
        }, 10 * 60 * 1000 /*10 minutes*/);
        try {
            const app = express();
            app.get('/callback', function (request, response) {
                const { access_token, refresh_token, error } = request.query;
                if (!error) {
                    res({ access_token, refresh_token });
                }
                else {
                    rej(error);
                }
                response.redirect(`${spotify_config_1.getAuthServerUrl()}/?message=${encodeURIComponent('You can now close this tab')}`);
                request.destroy();
            });
            server = app.listen(8350);
        }
        catch (e) {
            rej(e);
        }
    });
    return {
        createServerPromise, dispose: () => {
            server && server.close(() => {
                info_1.log('server closed');
            });
        }
    };
};
//# sourceMappingURL=local.js.map