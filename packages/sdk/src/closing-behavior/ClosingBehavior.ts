import { createComputed, createSignal } from '@/signals/utils.js';
import { postEvent } from '@/components/globals.js';

/**
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/closing-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/closing-behavior
 */

/**
 * Signal containing true, if the confirmation dialog should be shown while the user is trying to
 * close the Mini App.
 */
export const isConfirmationNeeded = createSignal(false, {
  set(value) {
    if (this.get() !== value) {
      postEvent()('web_app_setup_closing_behavior', { need_confirmation: value });
    }
    this.set(value);
  },
});

export const state = createComputed(() => ({
  isConfirmationNeeded: isConfirmationNeeded(),
}));

/**
 * Disables the confirmation dialog when closing the Mini App.
 */
export function disableConfirmation(): void {
  isConfirmationNeeded.set(false);
}

/**
 * Enables the confirmation dialog when closing the Mini App.
 */
export function enableConfirmation() {
  isConfirmationNeeded.set(true);
}
