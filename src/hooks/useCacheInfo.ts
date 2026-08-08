import { useSyncExternalStore } from 'react';
import { CacheInfo, getCacheInfo, subscribeToCacheInfo } from '../services/api';

/**
 * Track the cache status of the most recent API response.
 *
 * @returns The latest cache metadata, or null until the first API response arrives
 */
export const useCacheInfo = (): CacheInfo | null =>
  useSyncExternalStore(subscribeToCacheInfo, getCacheInfo, getCacheInfo);
