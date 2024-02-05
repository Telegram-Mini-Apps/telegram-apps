import { getFirstNavigationEntry } from './getFirstNavigationEntry.js';
import { retrieveFromUrl } from './retrieveFromUrl.js';
import type { LaunchParams } from './types.js';

/**
 * Attempts to read launch parameters using window.performance data.
 * @throws {Error} Unable to get first navigation entry.
 * @throws {Error} First navigation entry does not contain hash part.
 * @throws {TypeError} Unable to parse value.
 */
export function retrieveFromPerformance(): LaunchParams {
  const navigationEntry = getFirstNavigationEntry();
  if (!navigationEntry) {
    throw new Error('Unable to get first navigation entry.');
  }

  return retrieveFromUrl(navigationEntry.name);
}
