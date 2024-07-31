import { postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { isPageReload } from '@/navigation/isPageReload.js';

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
function disableConfirmation(): void {
  _.isConfirmationNeeded.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
function enableConfirmation() {
  _.isConfirmationNeeded.set(true);
}

/**
 * Mounts the component.
 */
function mount(): void {
  if (!_.isMounted()) {
    _.isConfirmationNeeded.set(isPageReload() && getStorageValue(STORAGE_KEY) || false);
    _.isConfirmationNeeded.sub(onStateChanged);
    _.isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  postEvent()('web_app_setup_closing_behavior', { need_confirmation: value });
  setStorageValue(STORAGE_KEY, value);
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  _.isConfirmationNeeded.unsub(onStateChanged);
  _.isMounted.set(false);
}

export {
  disableConfirmation,
  enableConfirmation,
  mount,
  unmount,
};
export {
  isConfirmationNeeded,
  isMounted,
} from './computed.js';
