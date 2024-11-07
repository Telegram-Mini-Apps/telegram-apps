import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { createWrapSafeMounted, } from '@/scopes/toolkit/createWrapSafeMounted.js';

type StorageValue = boolean;

const COMPONENT_NAME = 'closingBehavior';

/**
 * True if the Closing Behavior component is currently mounted.
 */
export const isMounted = signal(false);

const wrapMounted = createWrapSafeMounted(COMPONENT_NAME, isMounted);

/**
 * Disables closing confirmation dialog.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (disableConfirmation.isAvailable()) {
 *   disableConfirmation();
 * }
 */
export const disableConfirmation = wrapMounted('disableConfirmation', (): void => {
  setClosingConfirmation(false);
});

/**
 * Enables closing confirmation dialog.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (enableConfirmation.isAvailable()) {
 *   enableConfirmation();
 * }
 */
export const enableConfirmation = wrapMounted('enableConfirmation', (): void => {
  setClosingConfirmation(true);
});

/**
 * True if the confirmation dialog should be shown, while the user is trying
 * to close the Mini App.
 */
export const isConfirmationEnabled = signal(false);

/**
 * Mounts the Closing Behavior component restoring its state.
 */
export function mount(): void {
  if (!isMounted()) {
    setClosingConfirmation(
      isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME) || false,
      true,
    );
    isMounted.set(true);
  }
}

function setClosingConfirmation(value: boolean, force?: boolean): void {
  if (value !== isConfirmationEnabled() || force) {
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
