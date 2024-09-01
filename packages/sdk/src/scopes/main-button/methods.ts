import { off, on, type EventListener } from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { $postEvent } from '@/scopes/globals/globals.js';
import * as themeParams from '@/scopes/theme-params/instance.js';

import { state, isMounted } from './signals.js';
import type { State } from './types.js';

type StorageValue = State;

const CLICK_EVENT = 'main_button_pressed';
const STORAGE_KEY = 'mainButton';

/**
 * Adds a new main button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
export function onClick(fn: EventListener<'main_button_pressed'>): VoidFunction {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the main button click listener.
 * @param fn - an event listener.
 */
export function offClick(fn: EventListener<'main_button_pressed'>): void {
  off(CLICK_EVENT, fn);
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
    if (prev) {
      state.set(prev);
    } else {
      themeParams.mount();
      setParams({
        backgroundColor: themeParams.buttonColor(),
        textColor: themeParams.buttonTextColor(),
      });
    }

    state.sub(onStateChanged);
    isMounted.set(true);
  }
}

function onStateChanged(s: State): void {
  // We should not commit changes until the payload is correct. Some version of Telegram will
  // crash due to the empty value of the text.
  if (s.text) {
    $postEvent()('web_app_setup_main_button', {
      is_visible: s.isVisible,
      is_active: s.isActive,
      is_progress_visible: s.isLoaderVisible,
      text: s.text,
      color: s.backgroundColor,
      text_color: s.textColor,
    });
  }
  setStorageValue<StorageValue>(STORAGE_KEY, s);
}

/**
 * Updates the main button state.
 * @param updates - state changes to perform.
 */
export function setParams(updates: Partial<State>): void {
  state.set({
    ...state(),
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
  state.unsub(onStateChanged);
  isMounted.set(false);
}
