import { isLaunchParamsQuery, parseLaunchParamsQuery } from '@telegram-apps/transformers';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { LaunchParamsRetrieveError } from '@/errors.js';

const SESSION_STORAGE_KEY = 'launchParams';

/**
 * @param urlString - URL to extract launch parameters from.
 * @returns Launch parameters from the specified URL.
 * @throws Error if function was unable to extract launch parameters from the passed URL.
 */
function fromURL(urlString: string): string {
  return urlString
    // Replace everything before this first hashtag or question sign.
    .replace(/^[^?#]*[?#]/, '')
    // Replace all hashtags and question signs to make it look like some search params.
    .replace(/[?#]/g, '&');
}

/**
 * @returns Launch parameters in a raw format from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveRawLaunchParams(): string {
  const errors: [source: string, error: unknown][] = [];
  for (const [retrieve, source] of [
    // Try to retrieve launch parameters from the current location. This method can return
    // nothing in case, location was changed, and then the page was reloaded.
    [() => fromURL(window.location.href), 'window.location.href'],
    // Then, try using the lower level API - window.performance.
    [() => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return navigationEntry && fromURL(navigationEntry.name);
    }, 'performance navigation entries'],
    [() => getStorageValue<string>(SESSION_STORAGE_KEY), 'local storage'],
  ] as const) {
    const v = retrieve();
    if (!v) {
      errors.push([source, new Error('Source is empty')]);
      continue;
    }
    if (isLaunchParamsQuery(v)) {
      setStorageValue(SESSION_STORAGE_KEY, v);
      return v;
    }
    try {
      parseLaunchParamsQuery(v);
    } catch (e) {
      errors.push([source, e]);
    }
  }
  throw new LaunchParamsRetrieveError(errors);
}