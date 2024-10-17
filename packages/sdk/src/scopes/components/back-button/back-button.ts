import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWithIsMounted } from '@/scopes/toolkit/createWithIsMounted.js';

type StorageValue = boolean;

const WEB_APP_SETUP_BACK_BUTTON = 'web_app_setup_back_button';
const BACK_BUTTON_PRESSED = 'back_button_pressed';
const STORAGE_KEY = 'backButton';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @returns True if the Back Button is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_BACK_BUTTON);

const withIsSupported = createWithIsSupported(isSupported);
const withIsMounted = createWithIsMounted(isMounted);

/**
 * Hides the Back Button.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const hide = withIsMounted((): void => {
  isVisible.set(false);
});

/**
 * True if the Back Button is currently visible.
 */
export const isVisible = signal(false);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const mount = withIsSupported((): void => {
  if (!isMounted()) {
    isVisible.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    subAndCall(isVisible, onStateChanged);
    isMounted.set(true);
  }
});

function onStateChanged(): void {
  const value = isVisible();
  postEvent(WEB_APP_SETUP_BACK_BUTTON, { is_visible: value });
  setStorageValue<StorageValue>(STORAGE_KEY, value);
}

/**
 * Add a new Back Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const onClick = withIsSupported(
  (fn: EventListener<'back_button_pressed'>): VoidFunction => on(BACK_BUTTON_PRESSED, fn),
);

/**
 * Removes the Back Button click listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const offClick = withIsSupported((fn: EventListener<'back_button_pressed'>): void => {
  off(BACK_BUTTON_PRESSED, fn);
});

/**
 * Shows the Back Button.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const show = withIsMounted((): void => {
  isVisible.set(true);
});

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 */
export function unmount(): void {
  isVisible.unsub(onStateChanged);
  isMounted.set(false);
}
