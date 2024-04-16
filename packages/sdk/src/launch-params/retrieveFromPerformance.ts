import { getFirstNavigationEntry } from '@/navigation/getFirstNavigationEntry.js';

import { retrieveFromUrl } from './retrieveFromUrl.js';
import type { LaunchParams } from './types.js';

/**
 * @returns Launch parameters based on the first navigation entry.
 * @throws Error if function was unable to extract launch parameters from the navigation
 * entry.
 */
export function retrieveFromPerformance(): LaunchParams {
  const navigationEntry = getFirstNavigationEntry();
  if (!navigationEntry) {
    throw new Error('Unable to get first navigation entry.');
  }

  return retrieveFromUrl(navigationEntry.name);
}
