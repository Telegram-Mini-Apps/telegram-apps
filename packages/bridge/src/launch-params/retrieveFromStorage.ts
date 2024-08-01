import { parseLaunchParams } from '@/launch-params/parseLaunchParams.js';
import { getStorageValue } from '@/storage/storage.js';
import type { LaunchParams } from '@/launch-params/types.js';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParams {
  return parseLaunchParams(getStorageValue('launchParams') || '');
}
