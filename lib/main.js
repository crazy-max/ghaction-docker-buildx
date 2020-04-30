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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const installer = __importStar(require("./installer"));
const child_process = __importStar(require("child_process"));
const os = __importStar(require("os"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const github = __importStar(require("@actions/github"));
const stateHelper = __importStar(require("./state-helper"));
const path_1 = __importDefault(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (os.platform() !== 'linux') {
                core.setFailed('Only supported on linux platform');
                return;
            }
            const buildxVer = core.getInput('version') || core.getInput('buildx-version') || 'latest';
            const qemuVer = core.getInput('qemu-version') || 'latest';
            const dockerConfigHome = process.env.DOCKER_CONFIG || path_1.default.join(os.homedir(), '.docker');
            yield installer.getBuildx(buildxVer, dockerConfigHome);
            core.info(`⬇️ Downloading qemu-user-static Docker image...`);
            yield exec.exec('docker', ['pull', '-q', `multiarch/qemu-user-static:${qemuVer}`]);
            core.info(`💎 Installing QEMU static binaries...`);
            yield exec.exec('docker', ['run', '--rm', '--privileged', 'multiarch/qemu-user-static', '--reset', '-p', 'yes']);
            core.info('🔨 Creating a new builder instance...');
            yield exec.exec('docker', [
                'buildx',
                'create',
                '--name',
                `builder-${github.context.sha}`,
                '--driver',
                'docker-container',
                '--use'
            ]);
            core.info('🏃 Booting builder...');
            yield exec.exec('docker', ['buildx', 'inspect', '--bootstrap']);
            core.info('🐳 Docker info');
            yield exec.exec('docker', ['info']);
            core.info('🛒 Extracting available platforms...');
            const inspect = child_process.execSync('docker buildx inspect', {
                encoding: 'utf8'
            });
            for (const line of inspect.split(os.EOL)) {
                if (line.startsWith('Platforms')) {
                    core.setOutput('platforms', line.replace('Platforms: ', '').replace(/\s/g, '').trim());
                    break;
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.info('🚿 Removing builder instance...');
            yield exec.exec('docker', ['buildx', 'rm', `builder-${github.context.sha}`]);
        }
        catch (error) {
            core.warning(error.message);
        }
    });
}
// Main
if (!stateHelper.IsPost) {
    run();
}
// Post
else {
    cleanup();
}
