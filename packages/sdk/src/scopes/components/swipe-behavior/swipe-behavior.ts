import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWithIsMounted } from '@/scopes/toolkit/createWithIsMounted.js';

type StorageValue = boolean;

const WEB_APP_SETUP_SWIPE_BEHAVIOR = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @returns True if the Swipe Behavior is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_SWIPE_BEHAVIOR);

const withIsSupported = createWithIsSupported(isSupported);
const withIsMounted = createWithIsMounted(isMounted);

/**
 * Disables vertical swipes.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const disableVertical = withIsMounted((): void => {
  isVerticalEnabled.set(false);
});

/**
 * Enables vertical swipes.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const enableVertical = withIsMounted((): void => {
  isVerticalEnabled.set(true);
});

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(true);

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
 */
export function unmount(): void {
  isVerticalEnabled.unsub(onStateChanged);
  isMounted.set(false);
}
