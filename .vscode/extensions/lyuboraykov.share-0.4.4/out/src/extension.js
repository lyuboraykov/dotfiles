'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const firebase = require("firebase");
const vscode = require("vscode");
const sharer_1 = require("./sharer");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const config = {
        apiKey: "AIzaSyBvDvfsYtUxMg4kW22EilVC0z6T76q5_q4",
        authDomain: "vscode-share.firebaseapp.com",
        databaseURL: "https://vscode-share.firebaseio.com",
        storageBucket: "vscode-share.appspot.com",
        messagingSenderId: "1000407796204"
    };
    firebase.initializeApp(config);
    let disposableSharer = vscode.commands.registerCommand('extension.openSession', () => {
        sharer_1.default.shareCommand();
    });
    let disposableConnector = vscode.commands.registerCommand('extension.connectToSession', () => {
        sharer_1.default.connectToSessionCommand();
    });
    context.subscriptions.push(disposableSharer);
    context.subscriptions.push(disposableConnector);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map