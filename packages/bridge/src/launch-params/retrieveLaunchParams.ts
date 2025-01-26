import { LaunchParamsSchema, parseLaunchParamsQuery } from '@telegram-apps/transformers';
import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
} from '@telegram-apps/toolkit';
import type { InferOutput } from 'valibot';

import { LaunchParamsRetrieveError } from '@/errors.js';
import { retrieveFromStorage, saveToStorage } from '@/launch-params/storage.js';

export type RetrieveLPResult = ReturnType<typeof parseLaunchParamsQuery>;
export type RetrieveLPResultCamelCased =
  DeepConvertSnakeKeysToCamelCase<ReturnType<typeof parseLaunchParamsQuery>>;

/**
 * @param urlString - URL to extract launch parameters from.
 * @returns Launch parameters from the specified URL.
 * @throws Error if function was unable to extract launch parameters from the passed URL.
 */
function fromURL(urlString: string) {
  return parseLaunchParamsQuery(
    urlString
      // Replace everything before this first hashtag or question sign.
      .replace(/^[^?#]*[?#]/, '')
      // Replace all hashtags and question signs to make it look like some search params.
      .replace(/[?#]/g, '&'),
  );
}

/**
 * @returns Launch parameters based on the first navigation entry.
 * @throws Error if function was unable to extract launch parameters from the navigation entry.
 */
function retrieveFromPerformance() {
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!navigationEntry) {
    throw new Error('Unable to get first navigation entry.');
  }

  return fromURL(navigationEntry.name);
}

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: false): RetrieveLPResult;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase: true): RetrieveLPResultCamelCased;

/**
 * @returns Launch parameters from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: boolean):
  | InferOutput<typeof LaunchParamsSchema>
  | DeepConvertSnakeKeysToCamelCase<InferOutput<typeof LaunchParamsSchema>> {
  const errors: unknown[] = [];

  for (const retrieve of [
    // Try to retrieve launch parameters from the current location. This method can return
    // nothing in case, location was changed, and then the page was reloaded.
    () => fromURL(window.location.href),
    // Then, try using the lower level API - window.performance.
    retrieveFromPerformance,
    // Finally, try to extract launch parameters from the session storage.
    retrieveFromStorage,
  ]) {
    try {
      const lp = retrieve();
      saveToStorage(lp);
      return camelCase ? deepSnakeToCamelObjKeys(lp) : lp;
    } catch (e) {
      errors.push(e);
    }
  }

  throw new LaunchParamsRetrieveError(errors);
}
