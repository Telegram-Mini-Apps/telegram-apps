import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { createWithIsMounted } from '@/scopes/toolkit/createWithIsMounted.js';

type StorageValue = boolean;

const STORAGE_KEY = 'closingConfirmation';

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

const withIsMounted = createWithIsMounted(isMounted);

/**
 * Disables the confirmation dialog when closing the Mini App.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const disableConfirmation = withIsMounted((): void => {
  isConfirmationEnabled.set(false);
});

/**
 * True if the confirmation dialog should be shown while the user is trying to close the Mini App.
 */
export const isConfirmationEnabled = signal(false);

/**
 * Enables the confirmation dialog when closing the Mini App.
 * @throws {TypedError} ERR_NOT_MOUNTED
 */
export const enableConfirmation = withIsMounted((): void => {
  isConfirmationEnabled.set(true);
});

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isConfirmationEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    subAndCall(isConfirmationEnabled, onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(): void {
  const value = isConfirmationEnabled();
  postEvent('web_app_setup_closing_behavior', { need_confirmation: value });
  setStorageValue<StorageValue>(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  isConfirmationEnabled.unsub(onStateChanged);
  isMounted.set(false);
}
