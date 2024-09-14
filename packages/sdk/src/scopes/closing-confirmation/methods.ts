import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { $postEvent } from '@/scopes/globals/globals.js';

import { isEnabled, isMounted } from './signals.js';

type StorageValue = boolean;

const STORAGE_KEY = 'closingConfirmation';

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
export function disable(): void {
  isEnabled.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
export function enable(): void {
  isEnabled.set(true);
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    isEnabled.set(isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY) || false);
    isEnabled.sub(onStateChanged);
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
  isEnabled.unsub(onStateChanged);
  isMounted.set(false);
}
