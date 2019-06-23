"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const documentTracker_1 = require("./documentTracker");
const codelensProvider_1 = require("./codelensProvider");
const commandHandler_1 = require("./commandHandler");
const contentProvider_1 = require("./contentProvider");
const mergeDecorator_1 = require("./mergeDecorator");
const ConfigurationSectionName = 'better-merge';
class ServiceWrapper {
    constructor(context) {
        this.context = context;
        this.services = [];
    }
    begin() {
        let configuration = vscode.workspace.getConfiguration(ConfigurationSectionName);
        const documentTracker = new documentTracker_1.default();
        this.services.push(documentTracker, new commandHandler_1.default(this.context, documentTracker), new codelensProvider_1.default(this.context, documentTracker), new contentProvider_1.default(this.context), new mergeDecorator_1.default(this.context, documentTracker));
        this.services.forEach((service) => {
            if (service.begin && service.begin instanceof Function) {
                service.begin(configuration);
            }
        });
        vscode.workspace.onDidChangeConfiguration(() => {
            this.services.forEach((service) => {
                if (service.configurationUpdated && service.configurationUpdated instanceof Function) {
                    service.configurationUpdated(vscode.workspace.getConfiguration(ConfigurationSectionName));
                }
            });
        });
    }
    dispose() {
        if (this.services) {
            this.services.forEach(disposable => disposable.dispose());
            this.services = null;
        }
    }
}
exports.default = ServiceWrapper;
//# sourceMappingURL=index.js.map