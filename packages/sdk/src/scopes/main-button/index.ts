import { off, on, type EventListener } from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { computed, type Computed } from '@telegram-apps/signals';
import type { VoidFn } from '@telegram-apps/types';

import { $postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import * as themeParams from '@/scopes/theme-params/index.js';

import * as _ from './private.js';
import type { State } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/main-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/main-button
 */

const CLICK_EVENT = 'main_button_pressed';
const STORAGE_KEY = 'mainButton';

function createStateComputed<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => _.state()[key]);
}

/**
 * @see State.backgroundColor
 */
export const backgroundColor = createStateComputed('backgroundColor');

/**
 * @see State.isActive
 */
export const isActive = createStateComputed('isActive');

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * @see State.isLoaderVisible
 */
export const isLoaderVisible = createStateComputed('isLoaderVisible');

/**
 * @see State.isVisible
 */
export const isVisible = createStateComputed('isVisible');

/**
 * Add a new main button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
export function onClick(fn: EventListener<'main_button_pressed'>): VoidFn {
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
  if (!_.isMounted()) {
    const prev = isPageReload() && getStorageValue(STORAGE_KEY);
    if (prev) {
      _.state.set(prev);
    } else {
      themeParams.mount();
      setParams({
        backgroundColor: themeParams.buttonColor(),
        textColor: themeParams.buttonTextColor(),
      });
    }

    _.state.sub(onStateChanged);
    _.isMounted.set(true);
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
  setStorageValue(STORAGE_KEY, s);
}

/**
 * Complete component state.
 */
export const state = computed(_.state);


/**
 * Updates the main button state.
 * @param updates - state changes to perform.
 */
export function setParams(updates: Partial<State>): void {
  _.state.set({
    ..._.state(),
    ...Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    ),
  });
}

/**
 * @see State.text
 */
export const text = createStateComputed('text');

/**
 * @see State.textColor
 */
export const textColor = createStateComputed('textColor');

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 */
export function unmount(): void {
  _.state.unsub(onStateChanged);
  _.isMounted.set(false);
}
