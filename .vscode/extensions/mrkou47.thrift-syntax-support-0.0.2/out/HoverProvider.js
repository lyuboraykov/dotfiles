"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
const utils_1 = require("./utils");
const { openTextDocument } = vscode_1.workspace;
class ThriftHoverProvider {
    provideHover(document, position) {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const rawFile = document.getText();
        const processor = (rawText, doc) => {
            const thriftParseResult = thrift_parser_1.parse(rawText);
            if (thriftParseResult.type === thrift_parser_1.SyntaxType.ThriftDocument) {
                const helper = new utils_1.ASTHelper(thriftParseResult, doc);
                const wordNode = helper.findNodeByWord(word);
                const { includeNodes } = helper;
                if (wordNode) {
                    return Promise.resolve(new vscode_1.Hover(new vscode_1.MarkdownString(`(${wordNode.type}) **${wordNode.name.value}**`)));
                }
                const includeNode = includeNodes.find(item => {
                    return item.raw.indexOf(word) > -1;
                });
                if (includeNode) {
                    const { filePath, raw } = includeNode;
                    return openTextDocument(vscode_1.Uri.file(filePath)).then((iDoc) => {
                        return processor(raw, iDoc);
                    });
                }
            }
            return Promise.resolve(null);
        };
        return processor(rawFile, document);
    }
}
exports.default = ThriftHoverProvider;
//# sourceMappingURL=HoverProvider.js.map