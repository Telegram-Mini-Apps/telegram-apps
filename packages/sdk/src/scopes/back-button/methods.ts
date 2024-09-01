import { off, on, type EventListener } from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';
import { withIsSupported, type WithIsSupported } from '@/scopes/withIsSupported.js';
import { $postEvent } from '@/scopes/globals/globals.js';

import { isVisible, isMounted } from './signals.js';

type StorageValue = boolean;

const MINI_APPS_METHOD = 'web_app_setup_back_button';
const CLICK_EVENT = 'back_button_pressed';
const STORAGE_KEY = 'backButton';

/**
 * Hides the back button.
 */
export const hide: WithIsSupported<() => void> = withIsSupported(() => {
  isVisible.set(false);
}, MINI_APPS_METHOD);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isVisible.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    isVisible.sub(onStateChanged);
    isMounted.set(true);
  }
}

export function onStateChanged(isVisible: boolean) {
  $postEvent()(MINI_APPS_METHOD, { is_visible: isVisible });
  setStorageValue<StorageValue>(STORAGE_KEY, isVisible);
}

/**
 * Add a new back button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
export function onClick(fn: EventListener<'back_button_pressed'>): VoidFunction {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the back button click listener.
 * @param fn - an event listener.
 */
export function offClick(fn: EventListener<'back_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Shows the back button.
 */
export const show: WithIsSupported<() => void> = withIsSupported(() => {
  isVisible.set(true);
}, MINI_APPS_METHOD);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 */
export function unmount() {
  isVisible.unsub(onStateChanged);
  isMounted.set(false);
}
