import {
  getStorageValue,
  setStorageValue,
  type FullScreenErrorStatus,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { signal } from '@telegram-apps/signals';

import { request } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

import { FullScreenStatus } from "@/scopes/components/full-screen/types.js";

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
 * Signal indicating if the Full Screen is supported by telegram version.
 */
export const isSupported = createIsSupported(REQUEST_METHOD_NAME) || createIsSupported(EXIT_METHOD_NAME);

/**
 * Signal indicating if fullscreen mode is active.
 */
export const isFullScreen = signal(false);

const wrapSupported = createWrapSupported(COMPONENT_NAME, REQUEST_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, REQUEST_METHOD_NAME);

/**
 * Requests full screen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @returns {Promise<FullScreenStatus>} current status of full screen, boolean or error
 * @example
 * if (requestFullScreen.isAvailable()) {
 *   requestFullScreen();
 * }
 */
export const requestFullScreen = wrapComplete('requestFullScreen', (): Promise<FullScreenStatus> => {
  return setFullScreenMode(true);
});

/**
 * Exits full screen mode.
 * @since Mini Apps v8.0
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @returns {Promise<FullScreenStatus>} current status of full screen, boolean or error
 * @example
 * if (exitFullScreen.isAvailable()) {
 *   exitFullScreen();
 * }
 */
export const exitFullScreen = wrapComplete('exitFullScreen', (): Promise<FullScreenStatus> => {
  return setFullScreenMode(false);
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
    // do not call request here, otherwise app will collapse unintended (user sees additional flickering)
    setState(isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false);
    isMounted.set(true);
  }
});

async function setFullScreenMode(value: boolean): Promise<FullScreenStatus> {
  const METHOD = value ? REQUEST_METHOD_NAME : EXIT_METHOD_NAME;
  const r = await request(METHOD, [CHANGED_EVENT_NAME, FAILED_EVENT_NAME]);
  if ('error' in r) return processError(r.error);
  else setState(r.is_fullscreen);
  return isFullScreen();
}

function setState(value: boolean): void {
  setStorageValue<StorageValue>(COMPONENT_NAME, value);
  isFullScreen.set(value);
}

function processError(error: FullScreenErrorStatus): FullScreenErrorStatus {
  switch (error) {
    case 'ALREADY_FULLSCREEN':
      if (!isFullScreen()) setState(true);
      return 'ALREADY_FULLSCREEN';
    case 'UNSUPPORTED':
      setState(false);
      return 'UNSUPPORTED';
    default:
      return error;
  }
}

/**
 * Unmounts the Full Screen component.
 */
export function unmount(): void {
  isMounted.set(false);
}
