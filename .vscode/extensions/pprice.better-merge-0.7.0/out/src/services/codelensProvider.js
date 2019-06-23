"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class MergeConflictCodeLensProvider {
    constructor(context, tracker) {
        this.context = context;
        this.tracker = tracker;
        this.disposables = [];
    }
    begin(config) {
        this.config = config;
        this.disposables.push(vscode.languages.registerCodeLensProvider({ pattern: '**/*' }, this));
    }
    configurationUpdated(config) {
        this.config = config;
    }
    dispose() {
        if (this.disposables) {
            this.disposables.forEach(disposable => disposable.dispose());
            this.disposables = null;
        }
    }
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config || !this.config.enableCodeLens) {
                return null;
            }
            let conflicts = yield this.tracker.getConflicts(document);
            if (!conflicts || conflicts.length === 0) {
                return null;
            }
            let items = [];
            conflicts.forEach(conflict => {
                let acceptCurrentCommand = {
                    command: 'better-merge.accept.current',
                    title: `Accept current change`,
                    arguments: ['known-conflict', conflict]
                };
                let acceptIncomingCommand = {
                    command: 'better-merge.accept.incoming',
                    title: `Accept incoming change`,
                    arguments: ['known-conflict', conflict]
                };
                let acceptBothCommand = {
                    command: 'better-merge.accept.both',
                    title: `Accept both changes`,
                    arguments: ['known-conflict', conflict]
                };
                let diffCommand = {
                    command: 'better-merge.compare',
                    title: `Compare changes`,
                    arguments: [conflict]
                };
                items.push(new vscode.CodeLens(conflict.range, acceptCurrentCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 1 })), acceptIncomingCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 2 })), acceptBothCommand), new vscode.CodeLens(conflict.range.with(conflict.range.start.with({ character: conflict.range.start.character + 3 })), diffCommand));
            });
            return items;
        });
    }
    resolveCodeLens(codeLens, token) {
        return;
    }
}
exports.default = MergeConflictCodeLensProvider;
//# sourceMappingURL=codelensProvider.js.map