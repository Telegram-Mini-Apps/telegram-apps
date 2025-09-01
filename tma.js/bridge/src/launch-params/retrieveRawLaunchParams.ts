import { eitherFnToSimple, getStorageValue, setStorageValue } from '@tma.js/toolkit';
import { parseLaunchParamsQueryFp } from '@tma.js/transformers';
import * as E from 'fp-ts/Either';

import { LaunchParamsRetrieveError } from '@/errors.js';
import { pipe } from 'fp-ts/lib/function.js';

const SESSION_STORAGE_KEY = 'launchParams';

export type RetrieveRawLaunchParamsError = InstanceType<typeof LaunchParamsRetrieveError>;

/**
 * @param urlString - URL to extract launch parameters from.
 * @returns Launch parameters from the specified URL.
 * @throws Error if function was unable to extract launch parameters from the
 *   passed URL.
 */
function fromURL(urlString: string): string {
  return urlString
    // Replace everything before this first hashtag or question sign.
    .replace(/^[^?#]*[?#]/, '')
    // Replace all hashtags and question signs to make it look like some search
    // params.
    .replace(/[?#]/g, '&');
}

/**
 * @returns Launch parameters in a raw format from any known source.
 */
export function retrieveRawLaunchParamsFp(): E.Either<RetrieveRawLaunchParamsError, string> {
  const errors: { source: string; error: unknown }[] = [];

  for (const [retrieve, source] of [
    // Try to retrieve launch parameters from the current location. This method
    // can return nothing in case, location was changed, and then the page was
    // reloaded.
    [() => fromURL(window.location.href), 'window.location.href'],
    // Then, try using the lower level API - window.performance.
    [() => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return navigationEntry && fromURL(navigationEntry.name);
    }, 'performance navigation entries'],
    // Finally, try using the session storage.
    [() => getStorageValue<string>(SESSION_STORAGE_KEY), 'local storage'],
  ] as const) {
    const v = retrieve();
    if (!v) {
      errors.push({ source, error: new Error('Source is empty') });
      continue;
    }
    const maybeError = pipe(
      parseLaunchParamsQueryFp(v),
      E.foldW(err => err, () => true as const),
    );
    if (typeof maybeError !== 'boolean') {
      errors.push({ source, error: maybeError });
      continue;
    }
    setStorageValue(SESSION_STORAGE_KEY, v);
    return E.right(v);
  }
  return E.left(new LaunchParamsRetrieveError(errors));
}

/**
 * @see retrieveRawLaunchParamsFp
 */
export const retrieveRawLaunchParams = eitherFnToSimple(retrieveRawLaunchParamsFp);
