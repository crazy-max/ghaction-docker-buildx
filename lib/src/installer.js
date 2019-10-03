"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const download = __importStar(require("download"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const restm = __importStar(require("typed-rest-client/RestClient"));
const exec = __importStar(require("@actions/exec"));
let osPlat = os.platform();
function getBuildx(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const selected = yield determineVersion(version);
        if (selected) {
            version = selected;
        }
        const cliPluginsDir = path.join(os.homedir(), '.docker', 'cli-plugins');
        const pluginName = osPlat == 'win32' ? 'docker-buildx.exe' : 'docker-buildx';
        const downloadUrl = util.format('https://github.com/docker/buildx/releases/download/%s/%s', version, getFileName(version));
        console.log(`⬇️ Downloading ${downloadUrl}...`);
        yield download.default(downloadUrl, cliPluginsDir, { filename: pluginName });
        if (osPlat !== 'win32') {
            yield exec.exec('chmod', ['a+x', path.join(cliPluginsDir, pluginName)]);
        }
        return path.join(cliPluginsDir, pluginName);
    });
}
exports.getBuildx = getBuildx;
function getCliPluginsDir() {
    const cliPluginsPath = path.join(os.homedir(), '.docker', 'cli-plugins');
    fs.mkdirSync(cliPluginsPath, { recursive: true });
    return cliPluginsPath;
}
function getFileName(version) {
    const platform = osPlat == 'win32' ? 'windows' : osPlat;
    const ext = osPlat == 'win32' ? '.exe' : '';
    const filename = util.format('buildx-%s.%s-amd64%s', version, platform, ext);
    return filename;
}
function determineVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let rest = new restm.RestClient('ghaction-docker-buildx', 'https://github.com', undefined, {
            headers: {
                Accept: 'application/json'
            }
        });
        let res = yield rest.get(`/docker/buildx/releases/${version}`);
        if (res.statusCode != 200 || res.result === null) {
            throw new Error(`Cannot find Docker buildx ${version} release (http ${res.statusCode})`);
        }
        return res.result.tag_name;
    });
}
