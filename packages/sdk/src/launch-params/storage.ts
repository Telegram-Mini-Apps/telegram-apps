import { launchParamsParser } from '~/launch-params/launchParamsParser.js';

import { serializeLaunchParams } from './serializeLaunchParams.js';
import type { LaunchParams } from './types.js';

const SESSION_STORAGE_KEY = 'telegram-mini-apps-launch-params';

/**
 * Attempts to extract launch parameters directly from the session storage.
 * @returns Launch parameters in case, they were stored before or null, if there is no launch
 * parameters key in the session storage.
 * @throws {Error} Data stored in the session storage is invalid.
 */
export function retrieveFromStorage(): LaunchParams | null {
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);

  return raw
    // We are not handling the error on purpose as long as we are waiting for data stored by
    // this session storage key to contain the valid launch parameters.
    ? launchParamsParser().parse(raw)
    : null;
}

/**
 * Saves specified launch parameters in the session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  // TODO: We probably don't need serialize here. We used it only to correctly serialize Date
  //  values which being converted strings. To solve the problem we could improve date parser
  //  to allows parsing such invalid (Dates, converted to strings) values.
  sessionStorage.setItem(SESSION_STORAGE_KEY, serializeLaunchParams(value));
}
