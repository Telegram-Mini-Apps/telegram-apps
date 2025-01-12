import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';
import { serializeLaunchParamsQuery } from '@telegram-apps/transformers';
import type { LaunchParamsShape } from '@telegram-apps/transformers';
import type { LaunchParams } from '@telegram-apps/types';

import { parseLaunchParams } from './parseLaunchParams.js';

const STORAGE_KEY = 'launchParams';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParamsShape {
  return parseLaunchParams(getStorageValue(STORAGE_KEY) || '');
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParamsShape | LaunchParams): void {
  setStorageValue('launchParams', serializeLaunchParamsQuery(value));
}
