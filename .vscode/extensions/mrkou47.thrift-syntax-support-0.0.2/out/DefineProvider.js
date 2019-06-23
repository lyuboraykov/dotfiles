"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("./utils");
class ThriftDefineProvider {
    genLocation(loc, filePath) {
        return Promise.resolve(new vscode_1.Location(vscode_1.Uri.file(filePath), utils_1.genRange(loc)));
    }
    provideDefinition(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(position);
        const word = document.getText(wordRange);
        const rawFile = document.getText();
        const processor = (raw, filePath) => {
            const thriftParseResult = thrift_parser_1.parse(raw);
            if (thriftParseResult.type !== thrift_parser_1.SyntaxType.ThriftDocument) {
                return Promise.resolve(null);
            }
            const astHelper = new utils_1.ASTHelper(thriftParseResult, document);
            const wordNode = astHelper.findNodeByWord(word);
            const includeNodeList = astHelper.includeNodes;
            // if focus on thrift file name, redirect to this thrift file.
            const pathItem = includeNodeList.find(item => item.fileName === word);
            if (pathItem) {
                return Promise.resolve(new vscode_1.Location(vscode_1.Uri.file(pathItem.filePath), new vscode_1.Position(0, 0)));
            }
            // if can find focused word in this file, autojump
            if (wordNode)
                return this.genLocation(wordNode.name.loc, filePath);
            const includeNode = includeNodeList.find(item => {
                return item.raw.indexOf(word) > -1;
            });
            if (includeNode) {
                const { raw, filePath } = includeNode;
                return processor(raw, filePath);
            }
            return Promise.resolve(null);
        };
        return processor(rawFile, document.fileName);
        return new Promise(() => { });
    }
}
exports.default = ThriftDefineProvider;
//# sourceMappingURL=DefineProvider.js.map