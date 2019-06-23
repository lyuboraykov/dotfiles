"use strict";
const firebase_1 = require("firebase");
const utils_1 = require("./utils");
const vscode = require("vscode");
const VALUE_CHANGED_EVENT = 'value';
/**
 * Represents a room which is shared
 *
 * @export
 * @class Room
 */
class Room {
    /**
     * Creates an instance of Room.
     *
     * @param {string} roomName - the name of the room to create
     * @param {(content: string) => void} onContentChange - this will be called every
     * time content changes
     *
     * @memberOf Room
     */
    constructor(roomName, onContentChange) {
        this.roomName = roomName;
        this.roomPath = `rooms/${this.roomName}`;
        this.isConnected = false;
        this.onContentChangeCb = onContentChange;
    }
    /**
     * Start listening for changes in a room
     *
     * Every time there's a change call onContentChange
     *
     * @returns {void}
     *
     * @memberOf Room
     */
    connect(password) {
        if (this.isConnected) {
            return;
        }
        firebase_1.database().ref(this.roomPath).once(VALUE_CHANGED_EVENT, snapshot => {
            if (utils_1.sha1(password) === snapshot.val().password) {
                firebase_1.database().ref(this.roomPath).on(VALUE_CHANGED_EVENT, (snapshot) => {
                    this.onContentChangeCb(snapshot.val().content, snapshot.val().lastEditBy);
                });
                this.isConnected = true;
            }
            else {
                vscode.window.showInformationMessage('Wrong password');
            }
        });
    }
    /**
     * Create a new shared room and connect to it
     *
     * @memberOf Room
     */
    create(editorGuid, password) {
        firebase_1.database().ref(this.roomPath).set({
            content: '',
            lastEditBy: editorGuid,
            password: utils_1.sha1(password)
        });
    }
    /**
     * Stop listening for changes in a room
     *
     * @returns {void}
     *
     * @memberOf Room
     */
    disconnect() {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        firebase_1.database().ref(this.roomPath).off(VALUE_CHANGED_EVENT);
    }
    /**
     * Set the content of a room, useful to be applied as a callback somewhere
     *
     * @param {any} content
     * @returns {void}
     *
     * @memberOf Room
     */
    setContent(content, editBy) {
        if (!this.isConnected) {
            return;
        }
        firebase_1.database().ref(this.roomPath).set({
            content: content,
            lastEditBy: editBy
        });
    }
    /**
     * Get a list of all rooms available.
     *
     * @static
     * @returns {Thenable<string[]>}
     *
     * @memberOf Room
     */
    static getRoomNames() {
        return firebase_1.database().ref('rooms/').once(VALUE_CHANGED_EVENT).then(snapshot => {
            return Object.keys(snapshot.val());
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Room;
//# sourceMappingURL=room.js.map