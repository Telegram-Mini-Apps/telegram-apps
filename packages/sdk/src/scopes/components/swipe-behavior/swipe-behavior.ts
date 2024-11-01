import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createSafeWrap } from '@/scopes/toolkit/createSafeWrap.js';

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

const wrapMount = createSafeWrap(COMPONENT_NAME, isMounted);
const wrapSupport = createSafeWrap(COMPONENT_NAME, undefined, isSupported);

/**
 * Disables vertical swipes.
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (disableVertical.isAvailable()) {
 *   disableVertical();
 * }
 */
export const disableVertical = wrapMount('disableVertical', (): void => {
  setVerticalEnabled(false);
});

/**
 * Enables vertical swipes.
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (enableVertical.isAvailable()) {
 *   enableVertical();
 * }
 */
export const enableVertical = wrapMount('enableVertical', (): void => {
  setVerticalEnabled(true);
});

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(true);

/**
 * Mounts the Swipe Behavior component restoring its state.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupport('mount', (): void => {
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
 */
export function unmount(): void {
  isMounted.set(false);
}
