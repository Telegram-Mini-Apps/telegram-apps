import { postEvent } from '@/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { computed } from '@/signals/computed/computed.js';

import {
  isMounted as _isMounted,
  isConfirmationNeeded as _isConfirmationNeeded,
} from './closingBehavior.private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/closing-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/closing-behavior
 */

/**
 * True if the confirmation dialog should be shown while the user is trying to close the Mini App.
 */
const isConfirmationNeeded = computed(_isConfirmationNeeded);

/**
 * True if the component is currently mounted.
 */
const isMounted = computed(_isMounted);

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
function disableConfirmation(): void {
  _isConfirmationNeeded.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
function enableConfirmation() {
  _isConfirmationNeeded.set(true);
}

/**
 * Mounts the component.
 */
function mount(): void {
  if (!_isMounted()) {
    _isConfirmationNeeded.set(isPageReload() && getStorageValue('closingBehavior') || false);
    _isConfirmationNeeded.sub(onStateChanged);
    _isMounted.set(true);
    // todo listener
  }
}

function onStateChanged(isConfirmationNeeded: boolean): void {
  postEvent()('web_app_setup_closing_behavior', { need_confirmation: isConfirmationNeeded });
  setStorageValue('closingBehavior', isConfirmationNeeded);
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  _isConfirmationNeeded.unsub(onStateChanged);
}

export {
  disableConfirmation,
  enableConfirmation,
  isMounted,
  isConfirmationNeeded,
  mount,
  unmount,
};
