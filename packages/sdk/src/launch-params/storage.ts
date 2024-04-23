import { getStorageValue, setStorageValue } from '@/storage/storage.js';

import { parseLaunchParams } from './parseLaunchParams.js';
import { serializeLaunchParams } from './serializeLaunchParams.js';
import type { LaunchParams } from './types.js';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParams {
  return parseLaunchParams(getStorageValue('launchParams') || '');
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  setStorageValue('launchParams', serializeLaunchParams(value));
}
