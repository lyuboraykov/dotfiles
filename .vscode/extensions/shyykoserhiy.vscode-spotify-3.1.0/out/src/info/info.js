"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const moment = require("moment");
const spotify_config_1 = require("../config/spotify-config");
function showInformationMessage(message) {
    return vscode_1.window.showInformationMessage(`vscode-spotify: ${message}`);
}
exports.showInformationMessage = showInformationMessage;
function showWarningMessage(message) {
    return vscode_1.window.showWarningMessage(`vscode-spotify: ${message}`);
}
exports.showWarningMessage = showWarningMessage;
exports.log = (...args) => {
    spotify_config_1.getEnableLogs() && console.log.apply(console, ['vscode-spotify', moment().format('YYYY/MM/DD HH:MM:mm:ss:SSS'), ...args]);
};
//# sourceMappingURL=info.js.map