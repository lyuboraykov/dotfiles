"use strict";
const vscode = require("vscode");
const session_1 = require("./session");
const utils_1 = require("./utils");
class Sharer {
    /**
     * Initiate the command to open a sharing session
     *
     * @static
     *
     * @memberOf Sharer
     */
    static shareCommand() {
        const message = 'Enter the name of your session: ';
        vscode.window.showInputBox({ prompt: message }).then(sessionName => {
            if (!sessionName) {
                vscode.window.showErrorMessage('You need to enter a session name');
                return;
            }
            const session = new session_1.default(sessionName, Sharer.setEditorContent);
            session.create(Sharer.editorGuid);
            Sharer.connectToSession(sessionName);
            vscode.window.showInformationMessage(`Sharing to ${sessionName}.`);
            const fileName = vscode.window.activeTextEditor.document.fileName;
            vscode.window.setStatusBarMessage(`Sharing ${fileName} to ${sessionName}`);
        });
    }
    /**
     * Execute the command to connect to a session
     *
     * @static
     *
     * @memberOf Sharer
     */
    static connectToSessionCommand() {
        vscode.window.showQuickPick(session_1.default.getSessionNames()).then(sessionName => {
            if (sessionName) {
                Sharer.connectToSession(sessionName);
                vscode.window.showInformationMessage('Connected.');
                vscode.window.setStatusBarMessage(`Connected to ${sessionName}`);
            }
        });
    }
    /**
     * Hook the events for connecting from a session
     *
     * @private
     * @static
     * @param {string} sessionName
     *
     * @memberOf Sharer
     */
    static connectToSession(sessionName) {
        const session = new session_1.default(sessionName, Sharer.setEditorContent);
        session.connect();
        vscode.workspace.onDidChangeTextDocument(changeEvent => {
            session.setContent(changeEvent.document.getText(), Sharer.editorGuid);
        });
        vscode.workspace.onDidCloseTextDocument(changeEvent => {
            session.disconnect();
            vscode.window.setStatusBarMessage('');
        });
    }
    /**
     * Update the text content of the active editor
     *
     * @private
     * @static
     * @param {string} content
     *
     * @memberOf Sharer
     */
    static setEditorContent(content, lastEditBy) {
        if (lastEditBy !== Sharer.editorGuid) {
            const currentContent = vscode.window.activeTextEditor.document.getText();
            if (content != currentContent) {
                vscode.window.activeTextEditor.edit(edit => {
                    const lastLine = vscode.window.activeTextEditor.document.lineCount;
                    const lastChar = currentContent.length;
                    edit.replace(new vscode.Range(0, 0, lastLine, lastChar), content);
                });
            }
        }
    }
}
Sharer.editorGuid = utils_1.guid();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sharer;
//# sourceMappingURL=sharer.js.map