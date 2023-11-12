import { parse } from './parse.js';
import { getFirstNavigationEntry } from './getFirstNavigationEntry.js';
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

  const hashMatch = navigationEntry.name.match(/#(.*)/);
  if (!hashMatch) {
    throw new Error('First navigation entry does not contain hash part.');
  }

  return parse(hashMatch[1]);
}
