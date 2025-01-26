import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { postEvent } from '@/globals.js';
import { createWrapMounted } from '@/scopes/wrappers/createWrapMounted.js';
import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { createSignalsTuple } from '@/signals-registry.js';

type StorageValue = boolean;

const COMPONENT_NAME = 'closingBehavior';

/**
 * Signal indicating if the confirmation dialog should be shown, while the user
 * is trying to close the Mini App.
 */
export const [_isConfirmationEnabled, isConfirmationEnabled] = createSignalsTuple(false);

/**
 * Signal indicating if the Closing Behavior component is currently mounted.
 */
export const [_isMounted, isMounted] = createSignalsTuple(false);

const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);
const wrapBasic = createWrapBasic(COMPONENT_NAME);

/**
 * Disables the closing confirmation dialog.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @example
 * if (disableConfirmation.isAvailable()) {
 *   disableConfirmation();
 * }
 */
export const disableConfirmation = wrapMounted('disableConfirmation', (): void => {
  setClosingConfirmation(false);
});

/**
 * Enables the closing confirmation dialog.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @example
 * if (enableConfirmation.isAvailable()) {
 *   enableConfirmation();
 * }
 */
export const enableConfirmation = wrapMounted('enableConfirmation', (): void => {
  setClosingConfirmation(true);
});

/**
 * Mounts the Closing Behavior component restoring its state.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapBasic('mount', (): void => {
  if (!isMounted()) {
    setClosingConfirmation(
      isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false,
    );
    _isMounted.set(true);
  }
});

function setClosingConfirmation(value: boolean): void {
  if (value !== isConfirmationEnabled()) {
    postEvent('web_app_setup_closing_behavior', { need_confirmation: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    _isConfirmationEnabled.set(value);
  }
}

/**
 * Unmounts the Closing Behavior component.
 */
export function unmount(): void {
  _isMounted.set(false);
}
