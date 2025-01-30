import { off, on, type EventListener } from '@telegram-apps/bridge';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapComplete } from '@/scopes/wrappers/createWrapComplete.js';
import {
  createWrapSupported,
} from '@/scopes/wrappers/createWrapSupported.js';
import { createSignalsTuple } from '@/signals-registry.js';

type StorageValue = boolean;

const SETUP_METHOD_NAME = 'web_app_setup_settings_button';
const CLICK_EVENT_NAME = 'settings_button_pressed';
const COMPONENT_NAME = 'settingsButton';

/**
 * Signal indicating if the Settings Button is currently visible.
 */
export const [_isVisible, isVisible] = createSignalsTuple(false);

/**
 * Signal indicating if the Settings Button is currently mounted.
 */
export const [_isMounted, isMounted] = createSignalsTuple(false);

/**
 * Signal indicating if the Settings Button is supported.
 */
export const isSupported = createIsSupported(SETUP_METHOD_NAME);

const wrapSupported = createWrapSupported(COMPONENT_NAME, SETUP_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, _isMounted, SETUP_METHOD_NAME);

/**
 * Hides the Settings Button.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @since Mini Apps v6.10
 * @example
 * if (hide.isAvailable()) {
 *   hide();
 * }
 */
export const hide = wrapComplete('hide', (): void => {
  setVisibility(false);
});

/**
 * Mounts the Settings Button restoring its state.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @since Mini Apps v6.10
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported('mount', (): void => {
  if (!_isMounted()) {
    setVisibility(isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false);
    _isMounted.set(true);
  }
});

function setVisibility(value: boolean): void {
  if (value !== _isVisible()) {
    postEvent(SETUP_METHOD_NAME, { is_visible: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    _isVisible.set(value);
  }
}

/**
 * Adds a new Settings Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @since Mini Apps v6.10
 * @example
 * if (onClick.isAvailable()) {
 *   const off = onClick(() => {
 *     console.log('User clicked the Settings Button');
 *     off();
 *   });
 * }
 */
export const onClick = wrapSupported(
  'onClick',
  (fn: EventListener<'settings_button_pressed'>): VoidFunction => on(CLICK_EVENT_NAME, fn),
);

/**
 * Removes the Settings Button click listener.
 * @param fn - an event listener.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @since Mini Apps v6.10
 * @example
 * if (offClick.isAvailable()) {
 *   function listener() {
 *     console.log('User clicked the Settings Button');
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapSupported(
  'offClick',
  (fn: EventListener<'settings_button_pressed'>): void => {
    off(CLICK_EVENT_NAME, fn);
  },
);

/**
 * Shows the Settings Button.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @since Mini Apps v6.10
 * @example
 * if (show.isAvailable()) {
 *   show();
 * }
 */
export const show = wrapComplete('show', (): void => {
  setVisibility(true);
});

/**
 * Unmounts the Settings Button.
 *
 * Note that this function does not remove listeners added via the `onClick`
 * function, so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  _isMounted.set(false);
}
