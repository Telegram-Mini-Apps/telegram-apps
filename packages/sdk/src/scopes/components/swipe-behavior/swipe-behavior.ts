import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue, supports } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';

type StorageValue = boolean;

const MINI_APPS_METHOD = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * Disables vertical swipes.
 */
export function disableVertical(): void {
  isVerticalEnabled.set(false);
}

/**
 * Enables vertical swipes.
 */
export function enableVertical(): void {
  isVerticalEnabled.set(true);
}

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalEnabled = signal(false);

/**
 * @returns True if the back button is supported.
 */
export function isSupported(): boolean {
  return supports(MINI_APPS_METHOD, $version());
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isVerticalEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    subAndCall(isVerticalEnabled, onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(): void {
  const value = isVerticalEnabled();
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
