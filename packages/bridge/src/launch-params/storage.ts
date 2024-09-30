import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';
import { serializeLaunchParams } from '@telegram-apps/transformers';
import type { LaunchParams } from '@telegram-apps/types';

import { parseLaunchParams } from './parseLaunchParams.js';

const STORAGE_KEY = 'launchParams';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParams {
  return parseLaunchParams(getStorageValue(STORAGE_KEY) || '');
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  setStorageValue('launchParams', serializeLaunchParams(value));
}
