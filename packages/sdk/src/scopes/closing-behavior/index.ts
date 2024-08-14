import { computed } from '@telegram-apps/signals';
import { isPageReload } from '@telegram-apps/navigation';

import { $postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';

import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/closing-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/closing-behavior
 */

const STORAGE_KEY = 'closingBehavior';

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
export function disableConfirmation(): void {
  _.isConfirmationNeeded.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
export function enableConfirmation(): void {
  _.isConfirmationNeeded.set(true);
}

/**
 * True if the confirmation dialog should be shown while the user is trying to close the Mini App.
 */
export const isConfirmationNeeded = computed(_.isConfirmationNeeded);

/**
 * True if the component is currently mounted.
 * @see mount
 * @see unmount
 */
export const isMounted = computed(_.isMounted);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!_.isMounted()) {
    _.isConfirmationNeeded.set(isPageReload() && getStorageValue(STORAGE_KEY) || false);
    _.isConfirmationNeeded.sub(onStateChanged);
    _.isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  $postEvent()('web_app_setup_closing_behavior', { need_confirmation: value });
  setStorageValue(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  _.isConfirmationNeeded.unsub(onStateChanged);
  _.isMounted.set(false);
}
