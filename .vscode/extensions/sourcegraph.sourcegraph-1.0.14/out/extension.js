"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const opn_1 = __importDefault(require("opn"));
const vscode = __importStar(require("vscode"));
const config_1 = require("./config");
const git_1 = require("./git");
const VERSION = require('../package.json').version;
/**
 * Displays an error message to the user.
 */
function showError(err) {
    vscode.window.showErrorMessage(err.message);
}
const handleCommandErrors = (command) => (...args) => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield command(...args);
    }
    catch (error) {
        showError(error);
    }
});
/**
 * The command implementation for opening a cursor selection on Sourcegraph.
 */
function openCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error('No active editor');
        }
        const [remoteURL, branch, fileRel] = yield git_1.repoInfo(editor.document.uri.fsPath);
        if (remoteURL === '') {
            return;
        }
        // Open in browser.
        yield opn_1.default(`${config_1.getSourcegraphUrl()}/-/editor` +
            `?remote_url=${encodeURIComponent(remoteURL)}` +
            `&branch=${encodeURIComponent(branch)}` +
            `&file=${encodeURIComponent(fileRel)}` +
            `&editor=${encodeURIComponent('VSCode')}` +
            `&version=${encodeURIComponent(VERSION)}` +
            `&start_row=${encodeURIComponent(String(editor.selection.start.line))}` +
            `&start_col=${encodeURIComponent(String(editor.selection.start.character))}` +
            `&end_row=${encodeURIComponent(String(editor.selection.end.line))}` +
            `&end_col=${encodeURIComponent(String(editor.selection.end.character))}`);
    });
}
/**
 * The command implementation for searching a cursor selection on Sourcegraph.
 */
function searchCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error('No active editor');
        }
        const [remoteURL, branch, fileRel] = yield git_1.repoInfo(editor.document.uri.fsPath);
        const query = editor.document.getText(editor.selection);
        if (query === '') {
            return; // nothing to query
        }
        // Search in browser.
        yield opn_1.default(`${config_1.getSourcegraphUrl()}/-/editor` +
            `?remote_url=${encodeURIComponent(remoteURL)}` +
            `&branch=${encodeURIComponent(branch)}` +
            `&file=${encodeURIComponent(fileRel)}` +
            `&editor=${encodeURIComponent('VSCode')}` +
            `&version=${encodeURIComponent(VERSION)}` +
            `&search=${encodeURIComponent(query)}`);
    });
}
/**
 * Called when the extension is activated.
 */
function activate(context) {
    // Register our extension commands (see package.json).
    context.subscriptions.push(vscode.commands.registerCommand('extension.open', handleCommandErrors(openCommand)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.search', handleCommandErrors(searchCommand)));
}
exports.activate = activate;
function deactivate() {
    // no-op
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map