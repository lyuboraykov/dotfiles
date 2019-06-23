"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const DefineProvider_1 = require("./DefineProvider");
const HoverProvider_1 = require("./HoverProvider");
const CompletionProvider_1 = require("./CompletionProvider");
function activate(context) {
    const langMode = { scheme: 'file', language: 'thrift' };
    console.log('Congratulations, your extension "thrift-syntax-support" is now active!');
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(langMode, new DefineProvider_1.default()));
    context.subscriptions.push(vscode_1.languages.registerHoverProvider(langMode, new HoverProvider_1.default()));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(langMode, new CompletionProvider_1.default()));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map