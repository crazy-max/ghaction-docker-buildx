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

  const pluginPath: string = path.join(
    dockerConfigHome,
    'cli-plugins',
    osPlat == 'win32' ? 'docker-buildx.exe' : 'docker-buildx'
  );
  core.debug(`Plugin path is ${pluginPath}`);

  const downloadUrl = util.format(
    'https://github.com/docker/buildx/releases/download/%s/%s',
    release.tag_name,
    getFilename(release.tag_name)
  );

  core.info(`⬇️ Downloading ${downloadUrl}...`);
  const downloadPath: string = await tc.downloadTool(downloadUrl, pluginPath);
  core.debug(`Downloaded to ${downloadPath}`);

  core.info('🔨 Fixing perms...');
  await fs.chmodSync(downloadPath, '0755');

  return pluginPath;
}

const getFilename = (version: string): string => {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat;
  const ext: string = osPlat == 'win32' ? '.exe' : '';
  return util.format('buildx-%s.%s-amd64%s', version, platform, ext);
};
