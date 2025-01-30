import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { postEvent } from '@/globals.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { createWrapComplete } from '@/scopes/wrappers/createWrapComplete.js';
import {
  createWrapSupported,
} from '@/scopes/wrappers/createWrapSupported.js';
import { createSignalsTuple } from '@/signals-registry.js';

type StorageValue = boolean;

const SETUP_METHOD_NAME = 'web_app_setup_swipe_behavior';
const COMPONENT_NAME = 'swipeBehavior';

/**
 * Signal indicating if the Swipe Behavior component is currently mounted.
 */
export const [_isMounted, isMounted] = createSignalsTuple(false);

/**
 * Signal indicating if the Swipe Behavior is supported.
 */
export const isSupported = createIsSupported(SETUP_METHOD_NAME);

/**
 * Signal indicating if vertical swipes are enabled.
 */
export const [_isVerticalEnabled, isVerticalEnabled] = createSignalsTuple(true);

const wrapSupported = createWrapSupported(COMPONENT_NAME, SETUP_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, _isMounted, SETUP_METHOD_NAME);

/**
 * Disables vertical swipes.
 * @since Mini Apps v7.7
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @example
 * if (disableVertical.isAvailable()) {
 *   disableVertical();
 * }
 */
export const disableVertical = wrapComplete('disableVertical', (): void => {
  setVerticalEnabled(false);
});

/**
 * Enables vertical swipes.
 * @since Mini Apps v7.7
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @example
 * if (enableVertical.isAvailable()) {
 *   enableVertical();
 * }
 */
export const enableVertical = wrapComplete('enableVertical', (): void => {
  setVerticalEnabled(true);
});

/**
 * Mounts the Swipe Behavior component restoring its state.
 * @since Mini Apps v7.7
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported('mount', (): void => {
  if (!_isMounted()) {
    setVerticalEnabled(
      isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false,
      true,
    );
    _isMounted.set(true);
  }
});

function setVerticalEnabled(value: boolean, force?: boolean): void {
  if (value !== _isVerticalEnabled() || force) {
    postEvent(SETUP_METHOD_NAME, { allow_vertical_swipe: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    _isVerticalEnabled.set(value);
  }
}

/**
 * Unmounts the Swipe Behavior component.
 */
export function unmount(): void {
  _isMounted.set(false);
}
