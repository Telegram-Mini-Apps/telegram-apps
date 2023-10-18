import { serialize } from './serialize.js';
import { parse } from './parse.js';
import type { LaunchParams } from './types.js';

const SESSION_STORAGE_KEY = 'telegram-mini-apps-launch-params';

/**
 * Attempts to extract launch parameters directly from the sessionStorage.
 */
export function retrieveFromStorage(): LaunchParams | null {
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (raw) {
    try {
      return parse(raw);
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }

  return null;
}

/**
 * Saves specified launch params to session storage.
 * @param value - launch params to save.
 */
export function saveToStorage(value: LaunchParams): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY, serialize(value));
}
