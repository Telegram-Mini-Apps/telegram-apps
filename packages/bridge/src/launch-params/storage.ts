import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';
import {
  serializeLaunchParamsQuery,
  parseLaunchParamsQuery,
  LaunchParamsLike,
} from '@telegram-apps/transformers';

const STORAGE_KEY = 'launchParams';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage() {
  return parseLaunchParamsQuery(getStorageValue(STORAGE_KEY) || '');
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParamsLike): void {
  setStorageValue(STORAGE_KEY, serializeLaunchParamsQuery(value));
}
