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
import { createWrapSafeCommon } from '@/scopes/toolkit/createWrapSafeCommon.js';
import {
  createWrapSafeSupported
} from '@/scopes/toolkit/createWrapSafeSupported.js';

type StorageValue = boolean;

const WEB_APP_SETUP_BACK_BUTTON = 'web_app_setup_back_button';
const BACK_BUTTON_PRESSED = 'back_button_pressed';
const COMPONENT_NAME = 'backButton';

/**
 * True if the Back Button is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @returns True if the Back Button is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_BACK_BUTTON);

const wrapSafe = createWrapSafeCommon(COMPONENT_NAME, isMounted, WEB_APP_SETUP_BACK_BUTTON);
const wrapSupported = createWrapSafeSupported(COMPONENT_NAME, WEB_APP_SETUP_BACK_BUTTON);

/**
 * Hides the Back Button component.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (hide.isAvailable()) {
 *   hide();
 * }
 */
export const hide = wrapSafe('hide', (): void => {
  setVisibility(false);
});

/**
 * True if the Back Button component is currently visible.
 */
export const isVisible = signal(false);

/**
 * Mounts the Back Button component restoring its state.
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
    setVisibility(isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false, true);
    isMounted.set(true);
  }
});

function setVisibility(value: boolean, force?: boolean): void {
  if (value !== isVisible() || force) {
    postEvent(WEB_APP_SETUP_BACK_BUTTON, { is_visible: value });
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
 * @example
 * if (onClick.isAvailable()) {
 *   const off = onClick(() => {
 *     console.log('User clicked the Back Button);
 *     off();
 *   });
 * }
 */
export const onClick = wrapSupported(
  'onClick',
  (fn: EventListener<'back_button_pressed'>): VoidFunction => on(BACK_BUTTON_PRESSED, fn),
);

/**
 * Removes the Back Button click listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (offClick.isAvailable()) {
 *   function listener() {
 *     console.log('User clicked the Back Button);
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapSupported(
  'offClick',
  (fn: EventListener<'back_button_pressed'>): void => {
    off(BACK_BUTTON_PRESSED, fn);
  },
);

/**
 * Shows the Back Button component.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (show.isAvailable()) {
 *   show();
 * }
 */
export const show = wrapSafe('show', (): void => {
  setVisibility(true);
});

/**
 * Unmounts the Back Button component.
 *
 * Note that this function does not remove listeners added via the `onClick` function,
 * so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  isMounted.set(false);
}
