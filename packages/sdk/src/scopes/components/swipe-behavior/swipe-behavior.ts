import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSafeCommon } from '@/scopes/toolkit/createWrapSafeCommon.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

type StorageValue = boolean;

const WEB_APP_SETUP_SWIPE_BEHAVIOR = 'web_app_setup_swipe_behavior';
const COMPONENT_NAME = 'swipeBehavior';

/**
 * True if the Swipe Behavior component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @returns True if the Swipe Behavior component is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_SWIPE_BEHAVIOR);

const wrapSafe = createWrapSafeCommon(COMPONENT_NAME, isMounted, WEB_APP_SETUP_SWIPE_BEHAVIOR);
const wrapSupported = createWrapSafeSupported(COMPONENT_NAME, WEB_APP_SETUP_SWIPE_BEHAVIOR);

/**
 * Disables vertical swipes.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (disableVertical.isAvailable()) {
 *   disableVertical();
 * }
 */
export const disableVertical = wrapSafe('disableVertical', (): void => {
  setVerticalEnabled(false);
});

/**
 * Enables vertical swipes.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (enableVertical.isAvailable()) {
 *   enableVertical();
 * }
 */
export const enableVertical = wrapSafe('enableVertical', (): void => {
  setVerticalEnabled(true);
});

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(true);

/**
 * Mounts the Swipe Behavior component restoring its state.
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
    postEvent(WEB_APP_SETUP_SWIPE_BEHAVIOR, { allow_vertical_swipe: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    isVerticalEnabled.set(value);
  }
}

/**
 * Unmounts the Swipe Behavior component.
 * @example
 * unmount();
 */
export function unmount(): void {
  isMounted.set(false);
}
