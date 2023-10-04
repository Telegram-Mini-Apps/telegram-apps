import { parse } from './parse.js';
import { SESSION_STORAGE_KEY } from './const.js';
import type { LaunchParams } from './types.js';

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
