import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapComplete } from '@/scopes/toolkit/createWrapComplete.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

import { internalState, isMounted, state } from './signals.js';
import type { State } from './types.js';

type StorageValue = State;

const SETUP_METHOD_NAME = 'web_app_setup_secondary_button';
const CLICK_EVENT_NAME = 'secondary_button_pressed';
const COMPONENT_NAME = 'secondaryButton';

const wrapSupported = createWrapSupported(COMPONENT_NAME, SETUP_METHOD_NAME);
const wrapComplete = createWrapComplete(COMPONENT_NAME, isMounted, SETUP_METHOD_NAME);

/**
 * Signal indicating if the Secondary Button is supported.
 */
export const isSupported = createIsSupported(SETUP_METHOD_NAME);

/**
 * Mounts the Secondary Button restoring its state.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapSupported('mount', (): void => {
  if (!isMounted()) {
    const prev = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    prev && internalState.set(prev);
    isMounted.set(true);
  }
});

/**
 * Adds a new Secondary Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (onClick.isAvailable()) {
 *   const off = onClick(() => {
 *     console.log('User clicked the Secondary Button');
 *     off();
 *   });
 * }
 */
export const onClick = wrapSupported(
  'onClick',
  (fn: EventListener<'secondary_button_pressed'>): VoidFunction => on(CLICK_EVENT_NAME, fn),
);

/**
 * Removes the Secondary Button click listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (offClick.isAvailable()) {
 *   function listener() {
 *     console.log('User clicked the Secondary Button');
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapSupported(
  'offClick',
  (fn: EventListener<'secondary_button_pressed'>): void => {
    off(CLICK_EVENT_NAME, fn);
  },
);

/**
 * Updates the Secondary Button state.
 * @param updates - state changes to perform.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (setParams.isAvailable()) {
 *   setParams({
 *     text: 'Submit',
 *     isEnabled: true,
 *     isVisible: true,
 *     position: 'left',
 *   });
 * }
 */
export const setParams = wrapComplete(
  'setParams',
  (updates: Partial<State>): void => {
    internalState.set({
      ...internalState(),
      ...Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined),
      ),
    });
    setStorageValue<StorageValue>(COMPONENT_NAME, internalState());

    // We should not commit changes until the payload is correct. Some version of Telegram will
    // crash due to the empty value of the text.
    const s = state();
    s.text && postEvent(SETUP_METHOD_NAME, {
      color: s.backgroundColor,
      has_shine_effect: s.hasShineEffect,
      is_active: s.isEnabled,
      is_progress_visible: s.isLoaderVisible,
      is_visible: s.isVisible,
      position: s.position,
      text: s.text,
      text_color: s.textColor,
    });
  },
);

/**
 * Unmounts the Secondary Button.
 *
 * Note that this function does not remove listeners added via the `onClick`
 * function, so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  isMounted.set(false);
}