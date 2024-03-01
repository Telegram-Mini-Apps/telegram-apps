import { parseLaunchParams } from './parseLaunchParams.js';
import { serializeLaunchParams } from './serializeLaunchParams.js';
import type { LaunchParams } from './types.js';

const SESSION_STORAGE_KEY = 'telegram-mini-apps-launch-params';

/**
 * @returns Launch parameters stored in the session storage.
 * @throws Error if function was unable to extract launch parameters from the window location hash.
 */
export function retrieveFromStorage(): LaunchParams {
  return parseLaunchParams(sessionStorage.getItem(SESSION_STORAGE_KEY) || '');
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  // TODO: We probably don't need to serialize here. We used it only to correctly
  //  serialize Date values which being converted strings. To solve the problem we
  //  could improve date parser to allows parsing such invalid (Dates, converted to
  //  strings) values.
  sessionStorage.setItem(SESSION_STORAGE_KEY, serializeLaunchParams(value));
}
