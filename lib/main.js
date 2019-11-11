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
const installer = __importStar(require("./installer"));
const child_process = __importStar(require("child_process"));
const os = __importStar(require("os"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (os.platform() !== 'linux') {
                core.setFailed('Only supported on linux platform');
                return;
            }
            const version = core.getInput('version') || 'latest';
            yield installer.getBuildx(version);
            console.log('🐳 Docker info...');
            yield exec.exec('docker', ['info']);
            console.log('ℹ️ Buildx info');
            yield exec.exec('docker', ['buildx', 'version']);
            console.log('💎 Installing qemu-user-static...');
            yield exec.exec('docker', ['run', '--rm', '--privileged', 'multiarch/qemu-user-static', '--reset', '-p', 'yes']);
            console.log('🔨 Creating a new builder instance...');
            yield exec.exec('docker', ['buildx', 'create', '--name', 'builder', '--driver', 'docker-container', '--use']);
            console.log('🏃 Booting builder...');
            yield exec.exec('docker', ['buildx', 'inspect', '--bootstrap']);
            console.log('🛒 Extracting available platforms...');
            const inspect = child_process.execSync('docker buildx inspect', {
                encoding: 'utf8'
            });
            for (const line of inspect.split(os.EOL)) {
                if (line.startsWith('Platforms')) {
                    core.setOutput('platforms', line
                        .replace('Platforms: ', '')
                        .replace(/\s/g, '')
                        .trim());
                    break;
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
