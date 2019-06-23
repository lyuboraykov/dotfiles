"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../request/request");
const spotify_config_1 = require("../config/spotify-config");
const info_1 = require("../info/info");
const store_1 = require("../store/store");
const vscode_1 = require("vscode");
let previewUri = vscode_1.Uri.parse('vscode-spotify://authority/vscode-spotify');
let html = '';
class TextContentProvider {
    constructor() {
        this._onDidChange = new vscode_1.EventEmitter();
    }
    provideTextDocumentContent(_uri) {
        return html;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
}
let provider = new TextContentProvider();
function previewLyrics(lyrics) {
    return __awaiter(this, void 0, void 0, function* () {
        html = lyrics.trim();
        provider.update(previewUri);
        try {
            const document = yield vscode_1.workspace.openTextDocument(previewUri);
            yield vscode_1.window.showTextDocument(document, spotify_config_1.openPanelLyrics(), true);
        }
        catch (_ignored) {
            info_1.showInformationMessage('Failed to show lyrics' + _ignored);
        }
    });
}
class LyricsController {
    constructor() {
    }
    findLyrics() {
        return __awaiter(this, void 0, void 0, function* () {
            vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Window, title: 'Searching for lyrics. This might take a while.' }, () => {
                return this._findLyrics();
            });
        });
    }
    _findLyrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = store_1.getState();
            const { artist, name } = state.track;
            try {
                const result = yield request_1.xhr({ url: `${spotify_config_1.getLyricsServerUrl()}?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(name)}` });
                yield previewLyrics(`${result.responseText}`);
            }
            catch (e) {
                if (e.status === 404) {
                    yield previewLyrics(`Song lyrics for ${artist} - ${name} not found.\n You can add it on https://genius.com/ .`);
                }
                if (e.status === 500) {
                    yield previewLyrics(`Error: ${e.responseText}`);
                }
            }
        });
    }
}
exports.LyricsController = LyricsController;
exports.registration = vscode_1.workspace.registerTextDocumentContentProvider('vscode-spotify', provider);
//# sourceMappingURL=lyrics.js.map