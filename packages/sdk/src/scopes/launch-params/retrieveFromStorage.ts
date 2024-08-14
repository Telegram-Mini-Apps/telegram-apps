import type { LaunchParams } from '@telegram-apps/bridge';

import { getStorageValue } from '@/utils/storage.js';

import { parseLaunchParams } from './parseLaunchParams.js';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParams {
  return parseLaunchParams(getStorageValue('launchParams') || '');
}
