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
const interfaces = require("./interfaces");
const contentProvider_1 = require("./contentProvider");
const path = require("path");
const messages = {
    cursorNotInConflict: 'Editor cursor is not within a merge conflict',
    cursorOnSplitterRange: 'Editor cursor is within the merge conflict splitter, please move it to either the "current" or "incoming" block',
    noConflicts: 'No merge conflicts found in this file',
    noOtherConflictsInThisFile: 'No other merge conflicts within this file'
};
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["Forwards"] = 0] = "Forwards";
    NavigationDirection[NavigationDirection["Backwards"] = 1] = "Backwards";
})(NavigationDirection || (NavigationDirection = {}));
class CommandHandler {
    constructor(context, tracker) {
        this.context = context;
        this.tracker = tracker;
        this.disposables = [];
    }
    begin() {
        this.disposables.push(vscode.commands.registerTextEditorCommand('better-merge.accept.current', this.acceptCurrent, this), vscode.commands.registerTextEditorCommand('better-merge.accept.incoming', this.acceptIncoming, this), vscode.commands.registerTextEditorCommand('better-merge.accept.selection', this.acceptSelection, this), vscode.commands.registerTextEditorCommand('better-merge.accept.both', this.acceptBoth, this), vscode.commands.registerTextEditorCommand('better-merge.accept.all-current', this.acceptAllCurrent, this), vscode.commands.registerTextEditorCommand('better-merge.accept.all-incoming', this.acceptAllIncoming, this), vscode.commands.registerTextEditorCommand('better-merge.accept.all-both', this.acceptAllBoth, this), vscode.commands.registerTextEditorCommand('better-merge.next', this.navigateNext, this), vscode.commands.registerTextEditorCommand('better-merge.previous', this.navigatePrevious, this), vscode.commands.registerTextEditorCommand('better-merge.compare', this.compare, this));
    }
    acceptCurrent(editor, edit, ...args) {
        return this.accept(interfaces.CommitType.Current, editor, ...args);
    }
    acceptIncoming(editor, edit, ...args) {
        return this.accept(interfaces.CommitType.Incoming, editor, ...args);
    }
    acceptBoth(editor, edit, ...args) {
        return this.accept(interfaces.CommitType.Both, editor, ...args);
    }
    acceptAllCurrent(editor, edit, ...args) {
        return this.acceptAll(interfaces.CommitType.Current, editor);
    }
    acceptAllIncoming(editor, edit, ...args) {
        return this.acceptAll(interfaces.CommitType.Incoming, editor);
    }
    acceptAllBoth(editor, edit, ...args) {
        return this.acceptAll(interfaces.CommitType.Both, editor);
    }
    compare(editor, edit, conflict, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = path.basename(editor.document.uri.fsPath);
            // No conflict, command executed from command palette 
            if (!conflict) {
                conflict = yield this.findConflictContainingSelection(editor);
                // Still failed to find conflict, warn the user and exit 
                if (!conflict) {
                    vscode.window.showWarningMessage(messages.cursorNotInConflict);
                    return;
                }
            }
            let range = conflict.current.content;
            const leftUri = editor.document.uri.with({
                scheme: contentProvider_1.default.scheme,
                query: JSON.stringify(range)
            });
            const leftTitle = `Current changes`; // (Ln ${range.start.line}${!range.isSingleLine ? `-${range.end.line}` : ''})`;
            range = conflict.incoming.content;
            const rightUri = leftUri.with({ query: JSON.stringify(range) });
            const rightTitle = `Incoming changes`; // (Ln${range.start.line}${!range.isSingleLine ? `-${range.end.line}` : ''})`;
            const title = `${fileName}: ${leftTitle} \u2194 ${rightTitle}`;
            vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, title);
        });
    }
    navigateNext(editor, edit, ...args) {
        return this.navigate(editor, NavigationDirection.Forwards);
    }
    navigatePrevious(editor, edit, ...args) {
        return this.navigate(editor, NavigationDirection.Backwards);
    }
    acceptSelection(editor, edit, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let conflict = yield this.findConflictContainingSelection(editor);
            if (!conflict) {
                vscode.window.showWarningMessage(messages.cursorNotInConflict);
                return;
            }
            let typeToAccept = null;
            // Figure out if the cursor is in current or incoming, we do this by seeing if
            // the active position is before or after the range of the splitter. We can
            // use this trick as the previous check in findConflictByActiveSelection will
            // ensure it's within the conflict range, so we don't falsely identify "current"
            // or "incoming" if outside of a conflict range.
            if (editor.selection.active.isBefore(conflict.splitter.start)) {
                typeToAccept = interfaces.CommitType.Current;
            }
            else if (editor.selection.active.isAfter(conflict.splitter.end)) {
                typeToAccept = interfaces.CommitType.Incoming;
            }
            else {
                vscode.window.showWarningMessage(messages.cursorOnSplitterRange);
                return;
            }
            this.tracker.forget(editor.document);
            conflict.commitEdit(typeToAccept, editor);
        });
    }
    dispose() {
        if (this.disposables) {
            this.disposables.forEach(disposable => disposable.dispose());
            this.disposables = null;
        }
    }
    navigate(editor, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            let navigationResult = yield this.findConflictForNavigation(editor, direction);
            if (!navigationResult) {
                vscode.window.showWarningMessage(messages.noConflicts);
                return;
            }
            else if (!navigationResult.canNavigate) {
                vscode.window.showWarningMessage(messages.noOtherConflictsInThisFile);
                return;
            }
            // Move the selection to the first line of the conflict
            editor.selection = new vscode.Selection(navigationResult.conflict.range.start, navigationResult.conflict.range.start);
            editor.revealRange(navigationResult.conflict.range, vscode.TextEditorRevealType.Default);
        });
    }
    accept(type, editor, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let conflict = null;
            // If launched with known context, take the conflict from that
            if (args[0] === 'known-conflict') {
                conflict = args[1];
            }
            else {
                // Attempt to find a conflict that matches the current curosr position
                conflict = yield this.findConflictContainingSelection(editor);
            }
            if (!conflict) {
                vscode.window.showWarningMessage(messages.cursorNotInConflict);
                return;
            }
            // Tracker can forget as we know we are going to do an edit
            this.tracker.forget(editor.document);
            conflict.commitEdit(type, editor);
        });
    }
    acceptAll(type, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            let conflicts = yield this.tracker.getConflicts(editor.document);
            if (!conflicts || conflicts.length === 0) {
                vscode.window.showWarningMessage(messages.noConflicts);
                return;
            }
            // For get the current state of the document, as we know we are doing to do a large edit
            this.tracker.forget(editor.document);
            // Apply all changes as one edit
            yield editor.edit((edit) => conflicts.forEach(conflict => {
                conflict.applyEdit(type, editor, edit);
            }));
        });
    }
    findConflictContainingSelection(editor, conflicts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conflicts) {
                conflicts = yield this.tracker.getConflicts(editor.document);
            }
            if (!conflicts || conflicts.length === 0) {
                return null;
            }
            for (let i = 0; i < conflicts.length; i++) {
                if (conflicts[i].range.contains(editor.selection.active)) {
                    return conflicts[i];
                }
            }
            return null;
        });
    }
    findConflictForNavigation(editor, direction, conflicts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conflicts) {
                conflicts = yield this.tracker.getConflicts(editor.document);
            }
            if (!conflicts || conflicts.length === 0) {
                return null;
            }
            let selection = editor.selection.active;
            if (conflicts.length === 1) {
                if (conflicts[0].range.contains(selection)) {
                    return {
                        canNavigate: false
                    };
                }
                return {
                    canNavigate: true,
                    conflict: conflicts[0]
                };
            }
            let predicate = null;
            let fallback = null;
            if (direction === NavigationDirection.Forwards) {
                predicate = (conflict) => selection.isBefore(conflict.range.start);
                fallback = () => conflicts[0];
            }
            else if (direction === NavigationDirection.Backwards) {
                predicate = (conflict) => selection.isAfter(conflict.range.start);
                fallback = () => conflicts[conflicts.length - 1];
            }
            else {
                throw new Error(`Unsupported direction ${direction}`);
            }
            for (let i = 0; i < conflicts.length; i++) {
                if (predicate(conflicts[i]) && !conflicts[i].range.contains(selection)) {
                    return {
                        canNavigate: true,
                        conflict: conflicts[i]
                    };
                }
            }
            // Went all the way to the end, return the head
            return {
                canNavigate: true,
                conflict: fallback()
            };
        });
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=commandHandler.js.map