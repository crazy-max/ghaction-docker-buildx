import * as cache from '@actions/cache';
import path from 'path';

const cacheKeyPrefix = `ghaction-docker-buildx-${process.env['RUNNER_OS']}`;

export const getCachePath = (): string => {
  if (!process.env.RUNNER_TOOL_CACHE) {
    throw new Error('Expected RUNNER_TOOL_CACHE to be defined');
  }
  return path.join(process.env.RUNNER_TOOL_CACHE, 'ghaction-docker-buildx');
};

export const restoreCache = async (version: string): Promise<string | undefined> => {
  return await cache.restoreCache([getCachePath()], `${cacheKeyPrefix}-${version}`, [cacheKeyPrefix]);
};

export const saveCache = async (version: string): Promise<number> => {
  return await cache.saveCache([getCachePath()], `${cacheKeyPrefix}-${version}`);
};
