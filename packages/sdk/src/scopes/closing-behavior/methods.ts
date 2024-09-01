import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { $postEvent } from '@/scopes/globals/globals.js';

import { isConfirmationNeeded, isMounted } from './signals.js';

type StorageValue = boolean;

const STORAGE_KEY = 'closingBehavior';

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
export function disableConfirmation(): void {
  isConfirmationNeeded.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
export function enableConfirmation(): void {
  isConfirmationNeeded.set(true);
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isConfirmationNeeded.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    isConfirmationNeeded.sub(onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  $postEvent()('web_app_setup_closing_behavior', { need_confirmation: value });
  setStorageValue<StorageValue>(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  isConfirmationNeeded.unsub(onStateChanged);
  isMounted.set(false);
}
