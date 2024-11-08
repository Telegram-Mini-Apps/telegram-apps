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
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

type StorageValue = boolean;

const SETUP_METHOD_NAME = 'web_app_setup_back_button';
const CLICK_EVENT_NAME = 'back_button_pressed';
const COMPONENT_NAME = 'backButton';

/**
 * Signal indicating if the Back Button is currently visible.
 */
export const isVisible = signal(false);

/**
 * Signal indicating if the Back Button is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Signal indicating if the Back Button is supported.
 */
export const isSupported = createIsSupported(SETUP_METHOD_NAME);

const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, SETUP_METHOD_NAME);
const wrapSupported = createWrapSupported(COMPONENT_NAME, SETUP_METHOD_NAME);

/**
 * Hides the Back Button.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @since Mini Apps v6.1
 * @example
 * if (hide.isAvailable()) {
 *   hide();
 * }
 */
export const hide = wrapComplete('hide', (): void => {
  setVisibility(false);
});

/**
 * Mounts the Back Button restoring its state.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v6.1
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported('mount', (): void => {
  if (!isMounted()) {
    setVisibility(isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false);
    isMounted.set(true);
  }
});

function setVisibility(value: boolean): void {
  if (value !== isVisible()) {
    postEvent(SETUP_METHOD_NAME, { is_visible: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    isVisible.set(value);
  }
}

/**
 * Adds a new Back Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v6.1
 * @example
 * if (onClick.isAvailable()) {
 *   const off = onClick(() => {
 *     console.log('User clicked the Back Button');
 *     off();
 *   });
 * }
 */
export const onClick = wrapSupported(
  'onClick',
  (fn: EventListener<'back_button_pressed'>): VoidFunction => on(CLICK_EVENT_NAME, fn),
);

/**
 * Removes the Back Button click listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @since Mini Apps v6.1
 * @example
 * if (offClick.isAvailable()) {
 *   function listener() {
 *     console.log('User clicked the Back Button');
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapSupported(
  'offClick',
  (fn: EventListener<'back_button_pressed'>): void => {
    off(CLICK_EVENT_NAME, fn);
  },
);

/**
 * Shows the Back Button.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @since Mini Apps v6.1
 * @example
 * if (show.isAvailable()) {
 *   show();
 * }
 */
export const show = wrapComplete('show', (): void => {
  setVisibility(true);
});

/**
 * Unmounts the Back Button.
 *
 * Note that this function does not remove listeners added via the `onClick`
 * function, so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  isMounted.set(false);
}
