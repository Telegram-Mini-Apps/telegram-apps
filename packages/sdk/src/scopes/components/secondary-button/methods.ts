import {
  off,
  on,
  getStorageValue,
  setStorageValue,
  type EventListener, supports,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';

import { $version, postEvent } from '@/scopes/globals.js';
import { subAndCall } from '@/utils/subAndCall.js';

import { internalState, isMounted, state } from './signals.js';
import type { State } from './types.js';

type StorageValue = State;

const MINI_APPS_METHOD = 'web_app_setup_secondary_button';
const CLICK_EVENT = 'secondary_button_pressed';
const STORAGE_KEY = 'secondaryButton';

/**
 * @returns True if the Secondary Button is supported.
 */
export function isSupported(): boolean {
  return supports(MINI_APPS_METHOD, $version());
}

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!isMounted()) {
    const prev = isPageReload() && getStorageValue<StorageValue>(STORAGE_KEY);
    prev && internalState.set(prev);

    internalState.sub(onInternalStateChanged);
    subAndCall(state, onStateChanged);
    isMounted.set(true);
  }
}

/**
 * Adds a new main button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
export function onClick(fn: EventListener<'secondary_button_pressed'>): VoidFunction {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the main button click listener.
 * @param fn - an event listener.
 */
export function offClick(fn: EventListener<'secondary_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

function onInternalStateChanged(s: State): void {
  setStorageValue<StorageValue>(STORAGE_KEY, s);
}

function onStateChanged(): void {
  const s = state();

  // We should not commit changes until the payload is correct. Some version of Telegram will
  // crash due to the empty value of the text.
  s.text && postEvent(MINI_APPS_METHOD, {
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
 * Updates the main button state.
 * @param updates - state changes to perform.
 */
export function setParams(updates: Partial<State>): void {
  internalState.set({
    ...internalState(),
    ...Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    ),
  });
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 */
export function unmount(): void {
  internalState.unsub(onInternalStateChanged);
  state.unsub(onStateChanged);
  isMounted.set(false);
}
