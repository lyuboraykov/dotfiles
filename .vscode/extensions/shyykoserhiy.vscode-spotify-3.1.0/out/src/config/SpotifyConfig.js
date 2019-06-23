"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getConfig() {
    return vscode_1.workspace.getConfiguration('spotify');
}
function isButtonToBeShown(buttonName) {
    return getConfig().get('show' + buttonName[0].toUpperCase() + buttonName.slice(1), false);
}
exports.isButtonToBeShown = isButtonToBeShown;
function getButtonPriority(buttonName) {
    const config = getConfig();
    return config.get('priorityBase', 0) + config.get(buttonName + 'Priority', 0);
}
exports.getButtonPriority = getButtonPriority;
function getStatusCheckInterval() {
    return getConfig().get('statusCheckInterval', 5000);
}
exports.getStatusCheckInterval = getStatusCheckInterval;
function getLyricsServerUrl() {
    return getConfig().get('lyricsServerUrl', '');
}
exports.getLyricsServerUrl = getLyricsServerUrl;
function openPanelLyrics() {
    return getConfig().get('openPanelLyrics', 1);
}
exports.openPanelLyrics = openPanelLyrics;
function getUseCombinedApproachOnMacOS() {
    return getConfig().get('useCombinedApproachOnMacOS', false);
}
exports.getUseCombinedApproachOnMacOS = getUseCombinedApproachOnMacOS;
function getShowInitializationError() {
    return getConfig().get('showInitializationError', false);
}
exports.getShowInitializationError = getShowInitializationError;
function getTrackInfoFormat() {
    return getConfig().get('trackInfoFormat', '');
}
exports.getTrackInfoFormat = getTrackInfoFormat;
//# sourceMappingURL=SpotifyConfig.js.map