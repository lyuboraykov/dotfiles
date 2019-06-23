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
class MergeDectorator {
    constructor(context, tracker) {
        this.context = context;
        this.tracker = tracker;
        this.decorations = {};
        this.decorationUsesWholeLine = true; // Useful for debugging, set to false to see exact match ranges
        // TODO: Move to config?
        this.currentColorRgb = `32,200,94`;
        this.incomingColorRgb = `24,134,255`;
        this.config = null;
    }
    begin(config) {
        this.config = config;
        this.registerDecorationTypes(config);
        // Check if we already have a set of active windows, attempt to track these.
        vscode.window.visibleTextEditors.forEach(e => this.applyDecorations(e));
        vscode.workspace.onDidOpenTextDocument(event => {
            this.applyDecorationsFromEvent(event);
        }, null, this.context.subscriptions);
        vscode.workspace.onDidChangeTextDocument(event => {
            this.applyDecorationsFromEvent(event.document);
        }, null, this.context.subscriptions);
        vscode.window.onDidChangeActiveTextEditor((e) => {
            // New editor attempt to apply
            this.applyDecorations(e);
        }, null, this.context.subscriptions);
    }
    configurationUpdated(config) {
        this.config = config;
        this.registerDecorationTypes(config);
        // Re-apply the decoration
        vscode.window.visibleTextEditors.forEach(e => {
            this.removeDecorations(e);
            this.applyDecorations(e);
        });
    }
    registerDecorationTypes(config) {
        // Dispose of existing decorations
        Object.keys(this.decorations).forEach(k => this.decorations[k].dispose());
        this.decorations = {};
        // None of our features are enabled
        if (!config.enableDecorations || !config.enableEditorOverview) {
            return;
        }
        // Create decorators
        if (config.enableDecorations || config.enableEditorOverview) {
            this.decorations['current.content'] = vscode.window.createTextEditorDecorationType(this.generateBlockRenderOptions(this.currentColorRgb, config));
            this.decorations['incoming.content'] = vscode.window.createTextEditorDecorationType(this.generateBlockRenderOptions(this.incomingColorRgb, config));
        }
        if (config.enableDecorations) {
            this.decorations['current.header'] = vscode.window.createTextEditorDecorationType({
                // backgroundColor: 'rgba(255, 0, 0, 0.01)',
                // border: '2px solid red',
                isWholeLine: this.decorationUsesWholeLine,
                backgroundColor: `rgba(${this.currentColorRgb}, 1.0)`,
                color: 'white',
                after: {
                    contentText: ' (Current change)',
                    color: 'rgba(0, 0, 0, 0.7)'
                }
            });
            this.decorations['splitter'] = vscode.window.createTextEditorDecorationType({
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                color: 'white',
                isWholeLine: this.decorationUsesWholeLine,
            });
            this.decorations['incoming.header'] = vscode.window.createTextEditorDecorationType({
                backgroundColor: `rgba(${this.incomingColorRgb}, 1.0)`,
                color: 'white',
                isWholeLine: this.decorationUsesWholeLine,
                after: {
                    contentText: ' (Incoming change)',
                    color: 'rgba(0, 0, 0, 0.7)'
                }
            });
        }
    }
    dispose() {
        if (this.decorations) {
            Object.keys(this.decorations).forEach(name => {
                this.decorations[name].dispose();
            });
            this.decorations = null;
        }
    }
    generateBlockRenderOptions(color, config) {
        let renderOptions = {};
        if (config.enableDecorations) {
            renderOptions.backgroundColor = `rgba(${color}, 0.2)`;
            renderOptions.isWholeLine = this.decorationUsesWholeLine;
        }
        if (config.enableEditorOverview) {
            renderOptions.overviewRulerColor = `rgba(${color}, 0.5)`;
            renderOptions.overviewRulerLane = vscode.OverviewRulerLane.Full;
        }
        return renderOptions;
    }
    applyDecorationsFromEvent(eventDocument) {
        for (var i = 0; i < vscode.window.visibleTextEditors.length; i++) {
            if (vscode.window.visibleTextEditors[i].document === eventDocument) {
                // Attempt to apply
                this.applyDecorations(vscode.window.visibleTextEditors[i]);
            }
        }
    }
    applyDecorations(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor || !editor.document) {
                return;
            }
            if (!this.config || (!this.config.enableDecorations && !this.config.enableEditorOverview)) {
                return;
            }
            let conflicts = yield this.tracker.getConflicts(editor.document);
            if (conflicts.length === 0) {
                // TODO: Remove decorations
                this.removeDecorations(editor);
                return;
            }
            // Store decorations keyed by the type of decoration, set decoration wants a "style"
            // to go with it, which will match this key (see constructor);
            let matchDecorations = {};
            let pushDecoration = (key, d) => {
                matchDecorations[key] = matchDecorations[key] || [];
                matchDecorations[key].push(d);
            };
            conflicts.forEach(conflict => {
                // TODO, this could be more effective, just call getMatchPositions once with a map of decoration to position
                pushDecoration('current.content', { range: conflict.current.content });
                pushDecoration('incoming.content', { range: conflict.incoming.content });
                if (this.config.enableDecorations) {
                    pushDecoration('current.header', { range: conflict.current.header });
                    pushDecoration('splitter', { range: conflict.splitter });
                    pushDecoration('incoming.header', { range: conflict.incoming.header });
                }
            });
            // For each match we've generated, apply the generated decoration with the matching decoration type to the
            // editor instance. Keys in both matches and decorations should match.
            Object.keys(matchDecorations).forEach(decorationKey => {
                let decorationType = this.decorations[decorationKey];
                if (decorationType) {
                    editor.setDecorations(decorationType, matchDecorations[decorationKey]);
                }
            });
        });
    }
    removeDecorations(editor) {
        // Remove all decorations, there might be none
        Object.keys(this.decorations).forEach(decorationKey => {
            // Race condition, while editing the settings, it's possible to
            // generate regions before the configuration has been refreshed
            let decorationType = this.decorations[decorationKey];
            if (decorationType) {
                editor.setDecorations(decorationType, []);
            }
        });
    }
}
exports.default = MergeDectorator;
//# sourceMappingURL=mergeDecorator.js.map