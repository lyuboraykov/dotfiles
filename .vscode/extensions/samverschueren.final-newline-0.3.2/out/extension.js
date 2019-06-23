'use strict';
const vscode_1 = require('vscode');
const os_1 = require('os');
function activate(context) {
    const config = vscode_1.workspace.getConfiguration('files');
    const controller = new FinalNewLineController(config);
    context.subscriptions.push(controller);
}
exports.activate = activate;
class FinalNewLineController {
    constructor(config) {
        this._config = config;
        const subscriptions = [];
        vscode_1.workspace.onWillSaveTextDocument(this._onWillDocumentSave, this, subscriptions);
        vscode_1.workspace.onDidSaveTextDocument(this._onDidDocumentSave, this, subscriptions);
        vscode_1.workspace.onDidChangeConfiguration(this._onConfigChanged, this, subscriptions);
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onWillDocumentSave(e) {
        if (this._config.get('insertFinalNewline', false) === true) {
            if (vscode_1.window.activeTextEditor) {
                // Keep track of the current pre-save selections in case the cursor is at the last position
                this._selections = vscode_1.window.activeTextEditor.selections;
            }
            const doc = e.document;
            const lastLine = doc.lineAt(doc.lineCount - 1);
            if (lastLine.isEmptyOrWhitespace === false) {
                const edit = vscode_1.TextEdit.insert(new vscode_1.Position(doc.lineCount - 1, lastLine.text.length), os_1.EOL);
                e.waitUntil(Promise.resolve([
                    edit
                ]));
            }
        }
    }
    _onDidDocumentSave() {
        if (this._selections) {
            // Put back the selection before the save
            vscode_1.window.activeTextEditor.selections = this._selections;
            this._selections = undefined;
        }
    }
    _onConfigChanged() {
        this._config = vscode_1.workspace.getConfiguration('files');
    }
}
//# sourceMappingURL=extension.js.map