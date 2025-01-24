import type { CancelablePromise, PromiseOptions } from 'better-promises';
import type { HomeScreenStatus } from '@telegram-apps/bridge';

import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';

const METHOD_NAME = 'web_app_check_home_screen';

const [
  fn,
  tPromise,
  tError,
] = defineNonConcurrentFn((options?: PromiseOptions): CancelablePromise<HomeScreenStatus> => {
  return request(METHOD_NAME, 'home_screen_checked', options).then(d => d.status || 'unknown');
}, 'Check home screen status request is currently in progress');

/**
 * Sends a request to the native Telegram application to check if the current mini
 * application is added to the device's home screen.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {ConcurrentCallError} Check home screen status request is currently in progress
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (checkHomeScreenStatus.isAvailable()) {
 *   const status = await checkHomeScreenStatus();
 * }
 */
export const checkHomeScreenStatus = wrapSafe('checkHomeScreenStatus', fn, {
  isSupported: METHOD_NAME,
});
export const [, checkHomeScreenStatusPromise, isCheckingHomeScreenStatus] = tPromise;
export const [, checkHomeScreenStatusError] = tError;