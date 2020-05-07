import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

let osPlat: string = os.platform();

export async function getBuildx(version: string, dockerConfigHome: string): Promise<string> {
  const release: github.GitHubRelease | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find buildx ${version} release`);
  }

  core.info(`✅ Buildx version found: ${release.tag_name}`);
  const downloadUrl = util.format(
    'https://github.com/docker/buildx/releases/download/%s/%s',
    release.tag_name,
    getFilename(release.tag_name)
  );

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  const pluginsDir: string = path.join(dockerConfigHome, 'cli-plugins');
  core.debug(`Plugins dir is ${pluginsDir}`);
  if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir);
  }

  const pluginPath: string = path.join(pluginsDir, osPlat == 'win32' ? 'docker-buildx.exe' : 'docker-buildx');
  core.debug(`Plugin path is ${pluginsDir}`);
  fs.renameSync(downloadPath, pluginPath);

  core.info('🔨 Fixing perms...');
  fs.chmodSync(pluginPath, '0755');

  return pluginPath;
}

const getFilename = (version: string): string => {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat;
  const ext: string = osPlat == 'win32' ? '.exe' : '';
  return util.format('buildx-%s.%s-amd64%s', version, platform, ext);
};
