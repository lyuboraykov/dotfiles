"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
function getSourcegraphUrl() {
    const url = vscode_1.default.workspace.getConfiguration('sourcegraph').get('url'); // has default value
    if (url.endsWith('/')) {
        return url.slice(0, -1);
    }
    return url;
}
exports.getSourcegraphUrl = getSourcegraphUrl;
//# sourceMappingURL=config.js.map