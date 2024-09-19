import type { LaunchParams } from '@telegram-apps/types';
import { TypedError } from '@telegram-apps/toolkit';

import { ERR_RETRIEVE_LP_FAILED } from '@/errors.js';

import { retrieveFromLocation } from './retrieveFromLocation.js';
import { retrieveFromPerformance } from './retrieveFromPerformance.js';
import { retrieveFromStorage, saveToStorage } from './storage.js';

function unwrapError(e: unknown): string {
  if (e instanceof Error) {
    return e.message + (e.cause ? `\n  ${unwrapError(e.cause)}` : '');
  }
  return JSON.stringify(e);
}

/**
 * @returns Launch parameters from any known source.
 * @throws {TypedError} ERR_RETRIEVE_LP_FAILED
 */
export function retrieveLaunchParams(): LaunchParams {
  const errors: unknown[] = [];

  for (const retrieve of [
    // Try to retrieve launch parameters from the current location. This method can return
    // nothing in case, location was changed, and then the page was reloaded.
    retrieveFromLocation,
    // Then, try using the lower level API - window.performance.
    retrieveFromPerformance,
    // Finally, try to extract launch parameters from the session storage.
    retrieveFromStorage,
  ]) {
    try {
      const lp = retrieve();
      saveToStorage(lp);
      return lp;
    } catch (e) {
      errors.push(e);
    }
  }

  throw new TypedError(ERR_RETRIEVE_LP_FAILED, [
    'Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?',
    '📖 Refer to docs for more information:',
    'https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/environment',
    'Collected errors:',
    ...errors.map(e => `— ${unwrapError(e)}`),
  ].join('\n'));
}
