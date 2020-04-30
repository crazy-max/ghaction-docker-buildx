import fs = require('fs');
import * as installer from '../src/installer';
import * as path from 'path';
import * as os from 'os';

describe('installer', () => {
  it('acquires v0.2.2 version of buildx', async () => {
    const buildx = await installer.getBuildx('v0.2.2', path.join(os.homedir(), '.docker'));
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);

  it('acquires latest version of buildx', async () => {
    const buildx = await installer.getBuildx('latest', path.join(os.homedir(), '.docker'));
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);

  it('installs buildx in custom docker config home', async () => {
    // Arrange
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ghaction-docker-buildx-'));
    console.log(tmpDir);

    // Act
    await installer.getBuildx('latest', tmpDir);

    // Assert
    expect(fs.existsSync(path.join(tmpDir, 'cli-plugins', 'docker-buildx'))).toBe(true);
  }, 100000);
});
