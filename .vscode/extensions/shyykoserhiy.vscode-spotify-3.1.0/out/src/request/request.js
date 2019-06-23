"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const httpRequest = require("request-light");
function configureHttpRequest() {
    let httpSettings = vscode_1.workspace.getConfiguration('http');
    httpRequest.configure(httpSettings.get('proxy', ''), httpSettings.get('proxyStrictSSL', false));
}
exports.configureHttpRequest = configureHttpRequest;
function xhr(xhrOptions) {
    configureHttpRequest();
    return httpRequest.xhr(xhrOptions);
}
exports.xhr = xhr;
//# sourceMappingURL=request.js.map