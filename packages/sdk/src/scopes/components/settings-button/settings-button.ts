import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createSafeWrap } from '@/scopes/toolkit/createSafeWrap.js';

type StorageValue = boolean;

const WEB_APP_SETUP_SETTINGS_BUTTON = 'web_app_setup_settings_button';
const SETTINGS_BUTTON_PRESSED = 'settings_button_pressed';
const COMPONENT_NAME = 'settingsButton';

/**
 * True if the Settings Button component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @returns True if the settings button is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_SETTINGS_BUTTON);

const wrapMount = createSafeWrap(COMPONENT_NAME, isMounted);
const wrapSupport = createSafeWrap(COMPONENT_NAME, undefined, isSupported);

/**
 * Hides the Settings Button.
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (hide.isAvailable()) {
 *   hide();
 * }
 */
export const hide = wrapMount('hide', (): void => {
  setVisibility(false);
});

/**
 * True if the Settings Button component is currently visible.
 */
export const isVisible = signal(false);

/**
 * Mounts the Back Button component restoring its state.
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupport('mount', (): void => {
  if (!isMounted()) {
    setVisibility(isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false, true);
    isMounted.set(true);
  }
});

function setVisibility(value: boolean, force?: boolean): void {
  if (value !== isVisible() || force) {
    postEvent(WEB_APP_SETUP_SETTINGS_BUTTON, { is_visible: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    isVisible.set(value);
  }
}

/**
 * Adds a new Settings Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
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
export const onClick = wrapSupport(
  'onClick',
  (fn: EventListener<'settings_button_pressed'>): VoidFunction => on(SETTINGS_BUTTON_PRESSED, fn),
);

/**
 * Removes the Settings Button click listener.
 * @param fn - an event listener.
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
export const offClick = wrapSupport(
  'offClick',
  (fn: EventListener<'settings_button_pressed'>): void => {
    off(SETTINGS_BUTTON_PRESSED, fn);
  },
);

/**
 * Shows the Settings Button.
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (show.isAvailable()) {
 *   show();
 * }
 */
export const show = wrapMount('show', (): void => {
  setVisibility(true);
});

/**
 * Unmounts the Settings Button component.
 *
 * Note that this function does not remove listeners added via the `onClick` function,
 * so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  isMounted.set(false);
}
