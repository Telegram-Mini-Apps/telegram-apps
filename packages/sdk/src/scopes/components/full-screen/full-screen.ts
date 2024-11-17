import {
  on,
  off,
  getStorageValue,
  setStorageValue,
  type EventListener,
  type FullScreenErrorStatus,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

type StorageValue = boolean;

const REQUEST_METHOD_NAME = 'web_app_request_fullscreen';
const EXIT_METHOD_NAME = 'web_app_exit_fullscreen';

const CHANGED_EVENT_NAME = 'fullscreen_changed';
const FAILED_EVENT_NAME = 'fullscreen_failed';

const COMPONENT_NAME = 'fullScreen';

/**
 * Signal indicating if the Full Screen component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Signal indicating if the Full Screen is supported.
 */
export const isSupported = createIsSupported(REQUEST_METHOD_NAME);

/**
 * Signal indicating if fullscreen mode is active.
 */
export const isFullScreen = signal(false);

const wrapSupported = createWrapSupported(COMPONENT_NAME, REQUEST_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, REQUEST_METHOD_NAME);

/**
 * Request full screen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (requestFullScreen.isAvailable()) {
 *   requestFullScreen();
 * }
 */
export const requestFullScreen = wrapComplete('requestFullScreen', (): void => {
  setFullScreenMode(true);
});

/**
 * Exits full screen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (exitFullScreen.isAvailable()) {
 *   exitFullScreen();
 * }
 */
export const exitFullScreen = wrapComplete('exitFullScreen', (): void => {
  setFullScreenMode(false);
});

/**
 * Mounts the Full Screen component restoring its state.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported('mount', (): void => {
  if (!isMounted()) {
    setFullScreenMode(
      isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false,
      true,
    );
    isMounted.set(true);
  }
});

function setFullScreenMode(value: boolean, force?: boolean) {
  if (value !== isFullScreen() || force) {
    const METHOD = value ? REQUEST_METHOD_NAME : EXIT_METHOD_NAME;
    request(METHOD, CHANGED_EVENT_NAME)
      .then(r => setState(r.is_fullscreen))
      .catch(processError);
  }
}

function setState(value: boolean): void {
  setStorageValue<StorageValue>(COMPONENT_NAME, value);
  isFullScreen.set(value);
}

function processError(error: FullScreenErrorStatus): void {
  switch (error) {
    case 'UNSUPPORTED':
      console.log("FullScreen is unsupported by this device!");
      break;
    case 'ALREADY_FULLSCREEN':
      console.log("App is already in Full Screen!")
      break;
    default:
    // TODO: do nothing?
  }
}

/**
 * Adds a new Full Screen change listener.
 * Occurs whenever the Mini App enters or exits fullscreen mode.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (onChanged.isAvailable()) {
 *   const off = onChanged(() => {
 *     console.log('Full screen state changed');
 *     off();
 *   });
 * }
 */
export const onChanged = wrapComplete(
  'onChanged',
  (fn: EventListener<'fullscreen_changed'>): VoidFunction => on(CHANGED_EVENT_NAME, fn),
);

/**
 * Removes the Full Screen change listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (offChanged.isAvailable()) {
 *   function listener() {
 *     console.log('Full screen state changed');
 *     offChanged(listener);
 *   }
 *   onChanged(listener);
 * }
 */
export const offChanged = wrapComplete(
  'offChanged',
  (fn: EventListener<'fullscreen_changed'>): void => off(CHANGED_EVENT_NAME, fn),
);

/**
 * Adds a new Full Screen error listener.
 * Occurs if a request to enter fullscreen mode fails.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (onFailed.isAvailable()) {
 *   const off = onFailed(() => {
 *     console.error('Failed to enable Full Screen');
 *     off();
 *   });
 * }
 */
export const onFailed = wrapComplete(
  'onFailed',
  (fn: EventListener<'fullscreen_failed'>): VoidFunction => on(FAILED_EVENT_NAME, fn),
);

/**
 * Removes the Full Screen error listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v8.0
 * @example
 * if (offChanged.isAvailable()) {
 *   function listener() {
 *     console.log('Failed to enable Full Screen');
 *     offChanged(listener);
 *   }
 *   onChanged(listener);
 * }
 */
export const offFailed = wrapComplete(
  'offFailed',
  (fn: EventListener<'fullscreen_failed'>): void => off(FAILED_EVENT_NAME, fn),
);

/**
 * Unmounts the Full Screen component.
 */
export function unmount(): void {
  isMounted.set(false);
}
