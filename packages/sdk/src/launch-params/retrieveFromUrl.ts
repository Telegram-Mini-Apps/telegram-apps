import { parseLaunchParams } from './parseLaunchParams.js';
import type { LaunchParams } from './types.js';

/**
 * @param url - URL to extract launch parameters from.
 * @returns Launch parameters from the specified URL.
 * @throws Error if function was unable to extract launch parameters from the passed URL.
 */
export function retrieveFromUrl(url: string): LaunchParams {
  const queryParams = url.includes('?')
    // If URL includes "?", we expect it to possibly contain "#". The reason is TMA allows passing
    // start parameter via tgWebAppStartParam **query** parameter. Replacing "#" with "&" we
    // expect merging query parameters with hash parameters and creating complete launch
    // parameters information.
    ? url.replace('#', '&').slice(url.indexOf('?') + 1)
    // Otherwise, we expect specifying launch parameters only in the hash part.
    : url.slice(url.indexOf('#') + 1);

  return parseLaunchParams(queryParams);
}
