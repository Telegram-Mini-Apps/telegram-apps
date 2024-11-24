import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { createWrapMounted } from '@/scopes/toolkit/createWrapMounted.js';
import { removeUndefined } from '@/utils/removeUndefined.js';

import { internalState, isMounted, state } from './signals.js';
import type { State } from './types.js';

type StorageValue = State;

const SETUP_METHOD_NAME = 'web_app_setup_main_button';
const CLICK_EVENT_NAME = 'main_button_pressed';
const COMPONENT_NAME = 'mainButton';

const wrapBasic = createWrapBasic(COMPONENT_NAME);
const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);

/**
 * Mounts the Main Button restoring its state.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (mount.isAvailable()) {
 *   mount();
 * }
 */
export const mount = wrapBasic('mount', (): void => {
  if (!isMounted()) {
    const prev = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    prev && internalState.set(prev);
    isMounted.set(true);
  }
});

/**
 * Adds a new Main Button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (onClick.isAvailable()) {
 *   const off = onClick(() => {
 *     console.log('User clicked the Main Button');
 *     off();
 *   });
 * }
 */
export const onClick = wrapBasic(
  'onClick',
  (fn: EventListener<'main_button_pressed'>): VoidFunction => {
    return on(CLICK_EVENT_NAME, fn);
  },
);

/**
 * Removes the Main Button click listener.
 * @param fn - an event listener.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example
 * if (offClick.isAvailable()) {
 *   function listener() {
 *     console.log('User clicked the Main Button');
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapBasic(
  'offClick',
  (fn: EventListener<'main_button_pressed'>): void => {
    off(CLICK_EVENT_NAME, fn);
  },
);

/**
 * Updates the Main Button state.
 * @param updates - state changes to perform.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (setParams.isAvailable()) {
 *   setParams({
 *     text: 'Submit',
 *     isEnabled: true,
 *     hasShineEffect: true,
 *   });
 * }
 */
export const setParams = wrapMounted(
  'setParams',
  (updates: Partial<State>): void => {
    internalState.set({ ...internalState(), ...removeUndefined(updates) });
    setStorageValue<StorageValue>(COMPONENT_NAME, internalState());

    // We should not commit changes until the payload is correct.
    // Some version of Telegram will crash due to the empty value of the text.
    const s = state();
    s.text && postEvent(SETUP_METHOD_NAME, {
      color: s.backgroundColor,
      has_shine_effect: s.hasShineEffect,
      is_active: s.isEnabled,
      is_progress_visible: s.isLoaderVisible,
      is_visible: s.isVisible,
      text: s.text,
      text_color: s.textColor,
    });
  },
);

/**
 * Unmounts the Main Button.
 *
 * Note that this function does not remove listeners added via the `onClick`
 * function, so you have to remove them on your own.
 * @see onClick
 */
export function unmount(): void {
  isMounted.set(false);
}
