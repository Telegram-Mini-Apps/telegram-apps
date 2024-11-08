import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import {
  createWrapSupported
} from '@/scopes/toolkit/createWrapSupported.js';

type StorageValue = boolean;

const SETUP_METHOD_NAME = 'web_app_setup_swipe_behavior';
const COMPONENT_NAME = 'swipeBehavior';

/**
 * Signal indicating if the Swipe Behavior component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Signal indicating if the Swipe Behavior is supported.
 */
export const isSupported = createIsSupported(SETUP_METHOD_NAME);

/**
 * Signal indicating if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(true);

const wrapSupported = createWrapSupported(COMPONENT_NAME, SETUP_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, SETUP_METHOD_NAME);

/**
 * Disables vertical swipes.
 * @since Mini Apps v7.7
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (disableVertical.isAvailable()) {
 *   disableVertical();
 * }
 */
export const disableVertical = wrapComplete('disableVertical', (): void => {
  setVerticalEnabled(false);
});

/**
 * Enables vertical swipes.
 * @since Mini Apps v7.7
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (enableVertical.isAvailable()) {
 *   enableVertical();
 * }
 */
export const enableVertical = wrapComplete('enableVertical', (): void => {
  setVerticalEnabled(true);
});

/**
 * Mounts the Swipe Behavior component restoring its state.
 * @since Mini Apps v7.7
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
    setVerticalEnabled(
      isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false,
      true,
    );
    isMounted.set(true);
  }
});

function setVerticalEnabled(value: boolean, force?: boolean): void {
  if (value !== isVerticalEnabled() || force) {
    postEvent(SETUP_METHOD_NAME, { allow_vertical_swipe: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    isVerticalEnabled.set(value);
  }
}

/**
 * Unmounts the Swipe Behavior component.
 */
export function unmount(): void {
  isMounted.set(false);
}
