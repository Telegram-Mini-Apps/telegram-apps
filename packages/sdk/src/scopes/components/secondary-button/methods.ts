import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';

import { internalState, isMounted, state } from './signals.js';
import type { State } from './types.js';
import { createWrapSafeCommon } from '@/scopes/toolkit/createWrapSafeCommon.js';
import {
  createWrapSafeSupported,
} from '@/scopes/toolkit/createWrapSafeSupported.js';

type StorageValue = State;

const WEB_APP_SETUP_SECONDARY_BUTTON = 'web_app_setup_secondary_button';
const SECONDARY_BUTTON_PRESSED = 'secondary_button_pressed';
const COMPONENT_NAME = 'secondaryButton';

/**
 * @returns True if the Secondary Button is supported.
 */
export const isSupported = createIsSupported(WEB_APP_SETUP_SECONDARY_BUTTON);

const wrapSafe = createWrapSafeCommon(COMPONENT_NAME, isMounted, WEB_APP_SETUP_SECONDARY_BUTTON);
const wrapSupported = createWrapSafeSupported(COMPONENT_NAME, WEB_APP_SETUP_SECONDARY_BUTTON);

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
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

    internalState.sub(onInternalStateChanged);
    subAndCall(state, onStateChanged);
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
 *     console.log('User clicked the Secondary Button);
 *     off();
 *   });
 * }
 */
export const onClick = wrapSupported(
  'onClick',
  (fn: EventListener<'secondary_button_pressed'>): VoidFunction => on(SECONDARY_BUTTON_PRESSED, fn),
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
 *     console.log('User clicked the Secondary Button);
 *     offClick(listener);
 *   }
 *   onClick(listener);
 * }
 */
export const offClick = wrapSupported(
  'offClick',
  (fn: EventListener<'secondary_button_pressed'>): void => {
    off(SECONDARY_BUTTON_PRESSED, fn);
  },
);

function onInternalStateChanged(s: State): void {
  setStorageValue<StorageValue>(COMPONENT_NAME, s);
}

function onStateChanged(): void {
  const s = state();

  // We should not commit changes until the payload is correct. Some version of Telegram will
  // crash due to the empty value of the text.
  s.text && postEvent(WEB_APP_SETUP_SECONDARY_BUTTON, {
    color: s.backgroundColor,
    has_shine_effect: s.hasShineEffect,
    is_active: s.isEnabled,
    is_progress_visible: s.isLoaderVisible,
    is_visible: s.isVisible,
    position: s.position,
    text: s.text,
    text_color: s.textColor,
  });
}

/**
 * Updates the Secondary Button state.
 * @param updates - state changes to perform.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @example
 * if (setParams.isAvailable()) {
 *   setParams({
 *     text: 'Updated text',
 *     isEnabled: true,
 *   });
 * }
 */
export const setParams = wrapSafe(
  'setParams',
  (updates: Partial<State>): void => {
    internalState.set({
      ...internalState(),
      ...Object.fromEntries(
        Object.entries(updates).filter(([, v]) => v !== undefined),
      ),
    });
  },
);

/**
 * Unmounts the component, removing the listener, saving the component state
 * in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 * @example
 * unmount();
 */
export function unmount(): void {
  internalState.unsub(onInternalStateChanged);
  state.unsub(onStateChanged);
  isMounted.set(false);
}
