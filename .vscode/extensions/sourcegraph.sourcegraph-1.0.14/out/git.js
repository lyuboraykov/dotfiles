"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const path = __importStar(require("path"));
const log_1 = require("./log");
/**
 * Returns the names of all git remotes, e.g. ["origin", "foobar"]
 */
function gitRemotes(repoDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execa_1.default('git', ['remote'], { cwd: repoDir });
        return stdout.split('\n');
    });
}
/**
 * Returns the remote URL for the given remote name.
 * e.g. `origin` -> `git@github.com:foo/bar`
 */
function gitRemoteURL(repoDir, remoteName) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execa_1.default('git', ['remote', 'get-url', remoteName], { cwd: repoDir });
        return stdout;
    });
}
/**
 * Returns the remote URL of the first Git remote found.
 */
function gitDefaultRemoteURL(repoDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const remotes = yield gitRemotes(repoDir);
        if (remotes.length === 0) {
            throw new Error('no configured git remotes');
        }
        if (remotes.length > 1) {
            log_1.log.appendLine(`using first git remote: ${remotes[0]}`);
        }
        return yield gitRemoteURL(repoDir, remotes[0]);
    });
}
/**
 * Returns the repository root directory for any directory within the
 * repository.
 */
function gitRootDir(repoDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execa_1.default('git', ['rev-parse', '--show-toplevel'], { cwd: repoDir });
        return stdout;
    });
}
/**
 * Returns either the current branch name of the repository OR in all
 * other cases (e.g. detached HEAD state), it returns "HEAD".
 */
function gitBranch(repoDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execa_1.default('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repoDir });
        return stdout;
    });
}
/**
 * Returns the Git repository remote URL, the current branch, and the file path
 * relative to the repository root. Empty strings are returned if this cannot be
 * determined.
 */
function repoInfo(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let remoteURL = '';
        let branch = '';
        let fileRel = '';
        try {
            // Determine repository root directory.
            const fileDir = path.dirname(filePath);
            const repoRoot = yield gitRootDir(fileDir);
            // Determine file path, relative to repository root.
            fileRel = filePath.slice(repoRoot.length + 1);
            remoteURL = yield gitDefaultRemoteURL(repoRoot);
            branch = yield gitBranch(repoRoot);
            if (process.platform === 'win32') {
                fileRel = fileRel.replace(/\\/g, '/');
            }
        }
        catch (e) {
            log_1.log.appendLine(`repoInfo(${filePath}): ${e}`);
        }
        log_1.log.appendLine(`repoInfo(${filePath}): remoteURL="${remoteURL}" branch="${branch}" fileRel="${fileRel}"`);
        return [remoteURL, branch, fileRel];
    });
}
exports.repoInfo = repoInfo;
//# sourceMappingURL=git.js.map