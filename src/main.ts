import * as installer from './installer';
import * as child_process from 'child_process';
import * as os from 'os';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as stateHelper from './state-helper';
import path from 'path';

async function run() {
  try {
    if (os.platform() !== 'linux') {
      core.setFailed('Only supported on linux platform');
      return;
    }

    const buildxVer = core.getInput('version') || core.getInput('buildx-version') || 'latest';
    const qemuVer = core.getInput('qemu-version') || 'latest';
    const dockerConfigHome: string = process.env.DOCKER_CONFIG || path.join(os.homedir(), '.docker');
    await installer.getBuildx(buildxVer, dockerConfigHome);

    console.log('🐳 Docker info...');
    await exec.exec('docker', ['info']);

    console.log('ℹ️ Buildx info');
    await exec.exec('docker', ['buildx', 'version']);

    console.log(`⬇️ Downloading qemu-user-static Docker image...`);
    await exec.exec('docker', ['pull', '-q', `multiarch/qemu-user-static:${qemuVer}`]);

    console.log(`💎 Installing QEMU static binaries...`);
    await exec.exec('docker', ['run', '--rm', '--privileged', 'multiarch/qemu-user-static', '--reset', '-p', 'yes']);

    console.log('🔨 Creating a new builder instance...');
    await exec.exec('docker', [
      'buildx',
      'create',
      '--name',
      `builder-${github.context.sha}`,
      '--driver',
      'docker-container',
      '--use'
    ]);

    console.log('🏃 Booting builder...');
    await exec.exec('docker', ['buildx', 'inspect', '--bootstrap']);

    console.log('🛒 Extracting available platforms...');
    const inspect = child_process.execSync('docker buildx inspect', {
      encoding: 'utf8'
    });
    for (const line of inspect.split(os.EOL)) {
      if (line.startsWith('Platforms')) {
        core.setOutput('platforms', line.replace('Platforms: ', '').replace(/\s/g, '').trim());
        break;
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function cleanup(): Promise<void> {
  try {
    console.log('🚿 Removing builder instance...');
    await exec.exec('docker', ['buildx', 'rm', `builder-${github.context.sha}`]);
  } catch (error) {
    core.warning(error.message);
  }
}

// Main
if (!stateHelper.IsPost) {
  run();
}
// Post
else {
  cleanup();
}
