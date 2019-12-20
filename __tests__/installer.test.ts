import fs = require('fs');
import * as installer from '../src/installer';

describe('installer', () => {
  it('acquires v0.2.2 version of buildx', async () => {
    const buildx = await installer.getBuildx('v0.2.2');
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);

  it('acquires latest version of buildx', async () => {
    const buildx = await installer.getBuildx('latest');
    expect(fs.existsSync(buildx)).toBe(true);
  }, 100000);
});
