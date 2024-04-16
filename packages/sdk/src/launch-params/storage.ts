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
  // TODO: We probably don't need serialization here. We used it only to correctly
  //  serialize Date values which are being converted to strings. To solve the problem we
  //  could improve the Date parser to allow parsing such invalid (Dates, converted to
  //  strings) values.
  setStorageValue('launchParams', serializeLaunchParams(value));
}
