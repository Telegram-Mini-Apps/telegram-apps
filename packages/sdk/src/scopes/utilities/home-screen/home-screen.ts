import {
  on,
  type EventListener,
  off,
  type CancelablePromise,
  type HomeScreenStatus,
  type AsyncOptions,
  TypedError,
} from '@telegram-apps/bridge';

import { postEvent, request } from '@/scopes/globals.js';
import { wrapSafe } from '@/scopes/toolkit/wrapSafe.js';
import { computed, signal } from '@telegram-apps/signals';
import { signalifyAsyncFn } from '@/scopes/signalifyAsyncFn.js';
import { ERR_ALREADY_REQUESTING } from '@/errors.js';

const METHOD = 'web_app_add_to_home_screen';

const wrapOptions = { isSupported: METHOD } as const;

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
 * Prompts the user to add the Mini App to the home screen.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example Using `isAvailable`
 * if (addToHomeScreen.isAvailable()) {
 *   addToHomeScreen();
 * }
 * @example Using `ifAvailable`
 * addToHomeScreen.ifAvailable()
 */
export const addToHomeScreen = wrapSafe(
  'addToHomeScreen',
  () => {
    postEvent(METHOD);
  },
  wrapOptions,
);

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
      return request('web_app_check_home_screen', 'home_screen_checked', options)
        .then(r => r.status || 'unknown');
    },
    () => new TypedError(
      ERR_ALREADY_REQUESTING,
      'Check home screen status request is currently in progress',
    ),
    checkHomeScreenStatusPromise,
    checkHomeScreenStatusError,
  ),
  wrapOptions,
);

/**
 * Adds the event listener that being called whenever the user adds the current mini app to the
 * device's home screen.
 *
 * Note that if the device cannot determine the installation status, a corresponding event may
 * not be received even if the icon has been added.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (onAddedToHomeScreen.isAvailable()) {
 *   const off = onAddedToHomeScreen(() => {
 *     console.log('Added');
 *     off();
 *   });
 * }
 */
export const onAddedToHomeScreen = wrapSafe(
  'onAddedToHomeScreen',
  (listener: EventListener<'home_screen_added'>, once?: boolean) => {
    return on('home_screen_added', listener, once);
  },
  wrapOptions,
);

/**
 * Adds the event listener that being called whenever the user declines the request to add the
 * current mini app to the device's home screen.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (onAddToHomeScreenFailed.isAvailable()) {
 *   const off = onAddToHomeScreenFailed(() => {
 *     console.log('Failed to add to home screen');
 *     off();
 *   });
 * }
 */
export const onAddToHomeScreenFailed = wrapSafe(
  'onAddToHomeScreenFailed',
  (listener: EventListener<'home_screen_failed'>, once?: boolean) => {
    return on('home_screen_failed', listener, once);
  },
  wrapOptions,
);

/**
 * Removes add to home screen event listener.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (onAddedToHomeScreen.isAvailable()) {
 *   const handler = () => {
 *     console.log('Added');
 *     offAddedToHomeScreen(handler);
 *   };
 *   onAddedToHomeScreen(handler);
 * }
 */
export const offAddedToHomeScreen = wrapSafe(
  'offAddedToHomeScreen',
  (listener: EventListener<'home_screen_added'>) => {
    off('home_screen_added', listener);
  },
  wrapOptions,
);

/**
 * Removes add to home screen failed event listener.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (offAddToHomeScreenFailed.isAvailable()) {
 *   const handler = () => {
 *     console.log('Failed to add');
 *     offAddToHomeScreenFailed(handler);
 *   };
 *   onAddToHomeScreenFailed(handler);
 * }
 */
export const offAddToHomeScreenFailed = wrapSafe(
  'offAddToHomeScreenFailed',
  (listener: EventListener<'home_screen_failed'>) => {
    off('home_screen_failed', listener);
  },
  wrapOptions,
);
