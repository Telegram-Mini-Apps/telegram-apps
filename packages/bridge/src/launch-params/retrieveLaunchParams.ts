import { LaunchParamsSchema, parseLaunchParamsQuery } from '@telegram-apps/transformers';
import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
  TypedError,
} from '@telegram-apps/toolkit';
import type { InferOutput } from 'valibot';

import { ERR_RETRIEVE_LP_FAILED } from '@/errors.js';
import { retrieveFromStorage, saveToStorage } from '@/launch-params/storage.js';

function unwrapError(e: unknown): string {
  if (e instanceof Error) {
    return e.message + (e.cause ? `\n  ${unwrapError(e.cause)}` : '');
  }
  return JSON.stringify(e);
}

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
 * @throws {TypedError} ERR_RETRIEVE_LP_FAILED
 */
export function retrieveLaunchParams(camelCase?: false): InferOutput<typeof LaunchParamsSchema>;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {TypedError} ERR_RETRIEVE_LP_FAILED
 */
export function retrieveLaunchParams(camelCase: true): DeepConvertSnakeKeysToCamelCase<
  InferOutput<typeof LaunchParamsSchema>
>;

/**
 * @returns Launch parameters from any known source.
 * @throws {TypedError} ERR_RETRIEVE_LP_FAILED
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

  throw new TypedError(ERR_RETRIEVE_LP_FAILED, [
    'Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?',
    '📖 Refer to docs for more information:',
    'https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/environment',
    'Collected errors:',
    ...errors.map(e => `— ${unwrapError(e)}`),
  ].join('\n'));
}
