import { computed, signal } from '@telegram-apps/signals';
import {
  type AsyncOptions,
  type CancelablePromise,
  type HomeScreenStatus,
  TypedError,
} from '@telegram-apps/bridge';

import { ERR_ALREADY_REQUESTING } from '@/errors.js';
import { request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';

const METHOD = 'web_app_check_home_screen';

/**
 * Signal containing the home screen status check request promise.
 */
export const checkHomeScreenStatusPromise = signal<CancelablePromise<HomeScreenStatus> | undefined>();

/**
 * Signal containing the home screen status check request error.
 */
export const checkHomeScreenStatusError = signal<Error | undefined>();

/**
 * Signal indicating if the home screen status check is currently being requested.
 */
export const isCheckingHomeScreenStatus = computed(() => !!checkHomeScreenStatusPromise());

/**
 * Sends a request to the native Telegram application to check if the current mini
 * application is added to the device's home screen.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_ALREADY_REQUESTING
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (checkHomeScreenStatus.isAvailable()) {
 *   const status = await checkHomeScreenStatus();
 * }
 */
export const checkHomeScreenStatus = wrapSafe(
  'checkHomeScreenStatus',
  signalifyAsyncFn(
    (options?: AsyncOptions): CancelablePromise<HomeScreenStatus> => {
      return request(METHOD, 'home_screen_checked', options)
        .then(r => r.status || 'unknown');
    },
    () => new TypedError(
      ERR_ALREADY_REQUESTING,
      'Check home screen status request is currently in progress',
    ),
    checkHomeScreenStatusPromise,
    checkHomeScreenStatusError,
  ),
  { isSupported: METHOD },
);