"use strict";
const firebase_1 = require("firebase");
const VALUE_CHANGED_EVENT = 'value';
// TODO: rename it gradually
const FIREBASE_SESSIONS_PATH = 'rooms/';
/**
 * Represents a session which is shared
 *
 * @export
 * @class Session
 */
class Session {
    /**
     * Creates an instance of Session.
     *
     * @param {string} sessionName - the name of the Session to create
     * @param {(content: string) => void} onContentChange - this will be called every
     * time content changes
     *
     * @memberOf Session
     */
    constructor(sessionName, onContentChange) {
        this.sessionName = sessionName;
        this.sessionPath = `${FIREBASE_SESSIONS_PATH}${this.sessionName}`;
        this.isConnected = false;
        this.onContentChangeCb = onContentChange;
    }
    /**
     * Start listening for changes in a Session
     *
     * Every time there's a change call onContentChange
     *
     * @returns {void}
     *
     * @memberOf Session
     */
    connect() {
        if (this.isConnected) {
            return;
        }
        firebase_1.database().ref(this.sessionPath).on(VALUE_CHANGED_EVENT, (snapshot) => {
            let value = snapshot.val();
            this.onContentChangeCb(value.content, value.lastEditBy);
        });
        this.isConnected = true;
    }
    /**
     * Create a new shared Session and connect to it
     *
     * @memberOf Session
     */
    create(editorGuid) {
        firebase_1.database().ref(this.sessionPath).set({
            content: '',
            lastEditBy: editorGuid
        });
    }
    /**
     * Stop listening for changes in a Session
     *
     * @returns {void}
     *
     * @memberOf Session
     */
    disconnect() {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        firebase_1.database().ref(this.sessionPath).off(VALUE_CHANGED_EVENT);
    }
    /**
     * Set the content of a Session, useful to be applied as a callback somewhere
     *
     * @param {any} content
     * @returns {void}
     *
     * @memberOf Session
     */
    setContent(content, editBy) {
        if (!this.isConnected) {
            return;
        }
        firebase_1.database().ref(this.sessionPath).set({
            content: content,
            lastEditBy: editBy
        });
    }
    /**
     * Get a list of all Sessions available.
     *
     * @static
     * @returns {Thenable<string[]>}
     *
     * @memberOf Session
     */
    static getSessionNames() {
        return firebase_1.database().ref(FIREBASE_SESSIONS_PATH).once(VALUE_CHANGED_EVENT).then(snapshot => {
            return Object.keys(snapshot.val());
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Session;
//# sourceMappingURL=session.js.map