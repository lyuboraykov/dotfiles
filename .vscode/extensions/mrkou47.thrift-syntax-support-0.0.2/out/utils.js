"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
const fs = require("fs");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
exports.genZeroBasedNum = (num) => num - 1;
exports.wordNodeFilter = (word) => (item, index) => {
    if (item.type !== thrift_parser_1.SyntaxType.IncludeDefinition &&
        item.type !== thrift_parser_1.SyntaxType.CppIncludeDefinition &&
        item.name.value === word) {
        return item;
    }
};
exports.includeNodeFilter = () => (item, index) => {
    if (item.type === thrift_parser_1.SyntaxType.IncludeDefinition) {
        return item;
    }
};
exports.genRange = (loc) => {
    const { start, end } = loc;
    const startPosition = new vscode_1.Position(exports.genZeroBasedNum(start.line), exports.genZeroBasedNum(start.column));
    const endPosition = new vscode_1.Position(exports.genZeroBasedNum(end.line), exports.genZeroBasedNum(end.column));
    return new vscode_1.Range(startPosition, endPosition);
};
class ASTHelper {
    constructor(ast, document) {
        this.filter = (originalFn) => {
            const result = this.ast.body.filter(originalFn);
            return result;
        };
        this._findIncludeNodes = () => {
            const { filter, document } = this;
            return filter(exports.includeNodeFilter()).map(item => {
                const { value } = item.path;
                const filePath = path.resolve(path.dirname(document.fileName), value);
                return (Object.assign({}, item, { filePath, fileName: path.parse(value).name, raw: fs.readFileSync(filePath, { encoding: 'utf8' }) }));
            });
        };
        this.findNodesByInput = (input) => {
            return this.filter((item, index) => {
                if (item.type !== thrift_parser_1.SyntaxType.IncludeDefinition &&
                    item.type !== thrift_parser_1.SyntaxType.CppIncludeDefinition &&
                    item.name.value.indexOf(input) > -1) {
                    return item;
                }
            });
        };
        this.findNodesByWord = (word) => {
            return this.filter(exports.wordNodeFilter(word));
        };
        this.findNodeByWord = (word) => {
            return this.findNodesByWord(word)[0];
        };
        this.ast = ast;
        this.document = document;
        this.includeNodes = this._findIncludeNodes();
    }
}
exports.ASTHelper = ASTHelper;
//# sourceMappingURL=utils.js.map