import * as cache from '@actions/cache';
import path from 'path';

const cacheKeyPrefix = `ghaction-docker-buildx-${process.env['RUNNER_OS']}`;

export const getCachePath = (): string => {
  if (!process.env.RUNNER_TEMP) {
    throw new Error('Expected RUNNER_TEMP to be defined');
  }
  return path.join(process.env.RUNNER_TEMP, 'ghaction-docker-buildx');
};

export const restoreCache = async (version: string): Promise<string | undefined> => {
  return await cache.restoreCache([getCachePath()], `${cacheKeyPrefix}-${version}`, [`${cacheKeyPrefix}-${version}`]);
};

export const saveCache = async (version: string): Promise<number> => {
  return await cache.saveCache([getCachePath()], `${cacheKeyPrefix}-${version}`);
};
