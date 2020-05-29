import fs = require('fs');
import * as installer from '../src/installer';
import * as path from 'path';
import * as os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ghaction-docker-buildx-'));

describe('installer', () => {
  it('acquires v0.2.2 version of buildx', async () => {
    const buildx = await installer.getBuildx('v0.2.2', true, tmpDir);
    console.log(buildx);
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);

  it('acquires latest version of buildx', async () => {
    const buildx = await installer.getBuildx('latest', true, tmpDir);
    console.log(buildx);
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);
});
