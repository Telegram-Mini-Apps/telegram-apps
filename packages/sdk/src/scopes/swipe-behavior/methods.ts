import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';

import { postEvent } from '@/scopes/globals/globals.js';
import { withIsSupported } from '@/scopes/withIsSupported.js';

import { isMounted, isVerticalEnabled } from './signals.js';

type StorageValue = boolean;

const MINI_APPS_METHOD = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * Disables vertical swipes.
 */
export const disableVertical= withIsSupported((): void => {
  isVerticalEnabled.set(false);
}, MINI_APPS_METHOD);

/**
 * Enables vertical swipes.
 */
export const enableVertical = withIsSupported((): void => {
  isVerticalEnabled.set(true);
}, MINI_APPS_METHOD);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isVerticalEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    isVerticalEnabled.sub(onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  postEvent(MINI_APPS_METHOD, { allow_vertical_swipe: value });
  setStorageValue<StorageValue>(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  isVerticalEnabled.unsub(onStateChanged);
  isMounted.set(false);
}
