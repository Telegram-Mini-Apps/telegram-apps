import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/bridge';

import { postEvent } from '@/scopes/globals/globals.js';

import { isConfirmationEnabled, isMounted } from './signals.js';

type StorageValue = boolean;

const STORAGE_KEY = 'closingConfirmation';

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
export function disableConfirmation(): void {
  isConfirmationEnabled.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
export function enableConfirmation(): void {
  isConfirmationEnabled.set(true);
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isConfirmationEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    isConfirmationEnabled.sub(onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
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
