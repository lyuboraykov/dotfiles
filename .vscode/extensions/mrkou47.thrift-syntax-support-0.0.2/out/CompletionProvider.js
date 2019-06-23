"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs = require("fs");
const utils_1 = require("./utils");
const thrift_parser_1 = require("@creditkarma/thrift-parser");
// const { StructDefinition,  EnumDefinition, ConstDefinition, ExceptionDefinition, IncludeDefinition } = SyntaxType;
var CustomeSyntaxKind;
(function (CustomeSyntaxKind) {
    CustomeSyntaxKind[CustomeSyntaxKind["StructDefinition"] = 21] = "StructDefinition";
    CustomeSyntaxKind[CustomeSyntaxKind["EnumDefinition"] = 12] = "EnumDefinition";
    CustomeSyntaxKind[CustomeSyntaxKind["ConstDefinition"] = 20] = "ConstDefinition";
    CustomeSyntaxKind[CustomeSyntaxKind["ExceptionDefinition"] = 9] = "ExceptionDefinition";
    CustomeSyntaxKind[CustomeSyntaxKind["IncludeDefinition"] = 8] = "IncludeDefinition";
})(CustomeSyntaxKind = exports.CustomeSyntaxKind || (exports.CustomeSyntaxKind = {}));
const keyWords = [
    'include',
    'cpp_include',
    'namespace',
    'const',
    'typedef',
    'enum',
    'struct',
    'union',
    'exception',
    'extends',
    'service',
    'required',
    'optional',
    'oneway',
    'void',
    'throws',
    'bool',
    'byte',
    'i8',
    'i16',
    'i32',
    'i64',
    'double',
    'string',
    'binary',
    'slist',
    'map',
    'set',
    'list',
    'cpp_type'
];
const keywords2CompletionItem = () => keyWords.map(item => new vscode_1.CompletionItem(item, vscode_1.CompletionItemKind.Keyword));
class ThriftCompletionItemProvider {
    provideCompletionItems(document, position, token) {
        const word = document.getText(document.getWordRangeAtPosition(position)).split(/\r?\n/)[0];
        const raw = fs.readFileSync(document.fileName, { encoding: 'utf8' });
        const ast = thrift_parser_1.parse(raw);
        const completionItems = [];
        if (ast.type === thrift_parser_1.SyntaxType.ThriftDocument) {
            const helper = new utils_1.ASTHelper(ast, document);
            const wordNodes = helper.findNodesByInput(word);
            wordNodes.forEach(item => {
                completionItems.push(new vscode_1.CompletionItem(item.name.value, CustomeSyntaxKind[item.type]));
            });
        }
        return new Promise(function (resolve, reject) {
            Promise.all([
                keywords2CompletionItem(),
                completionItems,
            ])
                .then(function (results) {
                const suggestions = Array.prototype.concat.apply([], results);
                resolve(suggestions);
            })
                .catch(err => { reject(err); });
        });
    }
}
exports.default = ThriftCompletionItemProvider;
//# sourceMappingURL=CompletionProvider.js.map