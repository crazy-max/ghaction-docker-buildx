import * as download from 'download';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as restm from 'typed-rest-client/RestClient';
import * as exec from '@actions/exec';

let osPlat: string = os.platform();

export async function getBuildx(version: string, dockerConfigHome: string): Promise<string> {
  const selected = await determineVersion(version);
  if (selected) {
    version = selected;
  }

  const cliPluginsDir = path.join(dockerConfigHome, 'cli-plugins');
  const pluginName = osPlat == 'win32' ? 'docker-buildx.exe' : 'docker-buildx';
  const downloadUrl = util.format(
    'https://github.com/docker/buildx/releases/download/%s/%s',
    version,
    getFileName(version)
  );

  console.log(`⬇️ Downloading ${downloadUrl}...`);
  await download.default(downloadUrl, cliPluginsDir, {filename: pluginName});

  if (osPlat !== 'win32') {
    await exec.exec('chmod', ['a+x', path.join(cliPluginsDir, pluginName)]);
  }

  return path.join(cliPluginsDir, pluginName);
}

function getFileName(version: string): string {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat;
  const ext: string = osPlat == 'win32' ? '.exe' : '';
  const filename: string = util.format('buildx-%s.%s-amd64%s', version, platform, ext);
  return filename;
}

interface GitHubRelease {
  tag_name: string;
}

async function determineVersion(version: string): Promise<string> {
  let rest: restm.RestClient = new restm.RestClient('ghaction-docker-buildx', 'https://github.com', undefined, {
    headers: {
      Accept: 'application/json'
    }
  });

  let res: restm.IRestResponse<GitHubRelease> = await rest.get<GitHubRelease>(`/docker/buildx/releases/${version}`);
  if (res.statusCode != 200 || res.result === null) {
    throw new Error(`Cannot find Docker buildx ${version} release (http ${res.statusCode})`);
  }

  return res.result.tag_name;
}
