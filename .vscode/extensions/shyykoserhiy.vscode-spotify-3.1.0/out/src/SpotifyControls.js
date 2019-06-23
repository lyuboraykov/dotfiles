"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const SpotifyConfig_1 = require("./config/SpotifyConfig");
class SpotifyControls {
    constructor() {
        var buttonsInfo = [
            { id: 'next', text: '$(chevron-right)' },
            { id: 'previous', text: '$(chevron-left)' },
            { id: 'play', text: '$(triangle-right)' },
            { id: 'pause', text: '$(primitive-square)' },
            { id: 'playPause', text: '$(triangle-right)', dynamicText: (isPlaying) => { return isPlaying ? '$(primitive-square)' : '$(triangle-right)'; } },
            { id: 'muteVolume', text: '$(mute)' },
            { id: 'unmuteVolume', text: '$(unmute)' },
            { id: 'muteUnmuteVolume', text: '$(mute)', dynamicText: (isMuted) => { return isMuted ? '$(mute)' : '$(unmute)'; } },
            { id: 'volumeUp', text: '$(arrow-small-up)' },
            { id: 'volumeDown', text: '$(arrow-small-down)' },
            { id: 'toggleRepeating', text: '$(sync)', dynamicColor: (isRepeating) => { return isRepeating ? 'white' : 'darkgrey'; } },
            { id: 'toggleShuffling', text: '$(git-branch)', dynamicColor: (isShuffling) => { return isShuffling ? 'white' : 'darkgrey'; } },
            { id: 'lyrics', text: '$(book)' }
        ];
        const extension = vscode_1.extensions.getExtension('shyykoserhiy.vscode-spotify');
        if (!extension) {
            this._buttons = [];
            return;
        }
        var commands = extension.packageJSON.contributes.commands;
        this._buttons = buttonsInfo.map((item) => {
            const buttonName = item.id + 'Button';
            const buttonCommand = 'spotify.' + item.id;
            const buttonPriority = SpotifyConfig_1.getButtonPriority(buttonName);
            const visible = SpotifyConfig_1.isButtonToBeShown(buttonName);
            const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, buttonPriority);
            const { title } = commands.filter((command) => { return command.command === buttonCommand; })[0] || { title: '' };
            statusBarItem.text = item.text;
            statusBarItem.command = buttonCommand;
            statusBarItem.tooltip = title;
            return Object.assign({}, item, { buttonName, buttonCommand, buttonPriority, statusBarItem, visible });
        });
        this._buttons.forEach((button) => {
            if (button.id === 'playPause') {
                this._playPauseButton = button;
                return;
            }
            if (button.id === 'muteUnmuteVolume') {
                this._muteUnmuteVolumeButton = button;
                return;
            }
            if (button.id === 'toggleRepeating') {
                this._toggleRepeatingButton = button;
                return;
            }
            if (button.id === 'toggleShuffling') {
                this._toggleShufflingButton = button;
            }
        });
    }
    get buttons() {
        return this._buttons;
    }
    /**
     * Updates dynamicText buttons
     */
    updateDynamicButtons(playing, muted, repeating, shuffling) {
        var changed = false;
        changed = this._updateText(this._playPauseButton, playing) || changed;
        changed = this._updateText(this._muteUnmuteVolumeButton, muted) || changed;
        changed = this._updateColor(this._toggleRepeatingButton, repeating) || changed;
        changed = this._updateColor(this._toggleShufflingButton, shuffling) || changed;
        return changed;
    }
    /**
    * Show buttons that are visible
    */
    showVisible() {
        this.buttons.forEach((button) => { button.visible && button.statusBarItem.show(); });
    }
    /**
     * Hides all the buttons
     */
    hideAll() {
        this.buttons.forEach((button) => { button.statusBarItem.hide(); });
    }
    /**
    * Disposes all the buttons
    */
    dispose() {
        this.buttons.forEach((button) => { button.statusBarItem.dispose(); });
    }
    _updateText(button, condition) {
        if (!SpotifyConfig_1.isButtonToBeShown(button.buttonName)) {
            return false;
        }
        const dynamicText = button.dynamicText(condition);
        if (dynamicText !== button.statusBarItem.text) {
            button.statusBarItem.text = dynamicText;
            return true;
        }
        return false;
    }
    _updateColor(button, condition) {
        if (!SpotifyConfig_1.isButtonToBeShown(button.buttonName)) {
            return false;
        }
        const dynamicColor = button.dynamicColor(condition);
        if (dynamicColor !== button.statusBarItem.color) {
            button.statusBarItem.color = dynamicColor;
            return true;
        }
        return false;
    }
}
exports.SpotifyControls = SpotifyControls;
//# sourceMappingURL=SpotifyControls.js.map