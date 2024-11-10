import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createWrapMounted } from '@/scopes/toolkit/createWrapMounted.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';

type StorageValue = boolean;

const COMPONENT_NAME = 'closingBehavior';

/**
 * Signal indicating if the confirmation dialog should be shown, while the user
 * is trying to close the Mini App.
 */
export const isConfirmationEnabled = signal(false);

/**
 * Signal indicating if the Closing Behavior component is currently mounted.
 */
export const isMounted = signal(false);

const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);
const wrapBasic = createWrapBasic(COMPONENT_NAME);

/**
 * Disables the closing confirmation dialog.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_INITIALIZED
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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_INITIALIZED
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
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
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
    isMounted.set(true);
  }
});

function setClosingConfirmation(value: boolean): void {
  if (value !== isConfirmationEnabled()) {
    postEvent('web_app_setup_closing_behavior', { need_confirmation: value });
    setStorageValue<StorageValue>(COMPONENT_NAME, value);
    isConfirmationEnabled.set(value);
  }
}

/**
 * Unmounts the Closing Behavior component.
 */
export function unmount(): void {
  isMounted.set(false);
}
