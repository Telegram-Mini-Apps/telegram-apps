import { getStorageValue } from '@telegram-apps/toolkit';

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
 * Runs the specified function for each value, where the value is one stored in any known
 * launch parameters source.
 * @param fn - function to run. Should return false when the execution must be stopped.
 */
export function forEachLpSource(fn: (value: string) => boolean): void {
  for (const retrieve of [
    // Try to retrieve launch parameters from the current location. This method can return
    // nothing in case, location was changed, and then the page was reloaded.
    () => fromURL(window.location.href),
    // Then, try using the lower level API - window.performance.
    () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return navigationEntry ? fromURL(navigationEntry.name) : undefined;
    },
    () => getStorageValue<string>('launchParams') || '',
  ]) {
    const v = retrieve();
    if (v && !fn(v)) {
      return;
    }
  }
}