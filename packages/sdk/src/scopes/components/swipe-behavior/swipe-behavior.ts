import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue, supports } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import {
  createWithIsSupportedAndMounted,
} from '@/scopes/toolkit/createWithIsSupportedAndMounted.js';

type StorageValue = boolean;

const WEB_APP_SETUP_SWIPE_BEHAVIOR = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

const withIsSupported = createWithIsSupported(isSupported);
const withChecks = createWithIsSupportedAndMounted(isSupported, isMounted);

/**
 * Disables vertical swipes.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const disableVertical = withChecks((): void => {
  isVerticalEnabled.set(false);
});

/**
 * Enables vertical swipes.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const enableVertical = withChecks((): void => {
  isVerticalEnabled.set(true);
});

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(false);

/**
 * @returns True if the back button is supported.
 */
export function isSupported(): boolean {
  return supports(WEB_APP_SETUP_SWIPE_BEHAVIOR, $version());
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const mount = withIsSupported((): void => {
  if (!isMounted()) {
    isVerticalEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    subAndCall(isVerticalEnabled, onStateChanged);
    isMounted.set(true);
  }
});

function onStateChanged(): void {
  const value = isVerticalEnabled();
  postEvent(WEB_APP_SETUP_SWIPE_BEHAVIOR, { allow_vertical_swipe: value });
  setStorageValue<StorageValue>(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const unmount = withIsSupported((): void => {
  isVerticalEnabled.unsub(onStateChanged);
  isMounted.set(false);
});
