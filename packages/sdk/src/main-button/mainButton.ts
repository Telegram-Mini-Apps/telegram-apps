import { postEvent } from '@/components/globals.js';
import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { signal } from '@/signals/signal/signal.js';
import { computed, type Computed } from '@/signals/computed/computed.js';
import type { RGB } from '@/colors/types.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/main-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/main-button
 */

export interface State {
  /**
   * The main button background color.
   */
  backgroundColor: RGB;
  /**
   * True if the main button is currently clickable.
   */
  isActive: boolean;
  /**
   * True if the main button loader is visible.
   */
  isLoaderVisible: boolean;
  /**
   * True if the main button is visible.
   */
  isVisible: boolean;
  /**
   * The main button text.
   */
  text: string;
  /**
   * The main button text color.
   */
  textColor: RGB;
}

const CLICK_EVENT = 'main_button_pressed';

const initialState: State = {
  backgroundColor: '#000000',
  isActive: false,
  isLoaderVisible: false,
  isVisible: false,
  text: '',
  textColor: '#000000',
};

function createStateComputed<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => state()[key]);
}

export const state = signal<State>(initialState, {
  set(s, value) {
    // We should not commit changes until the payload is correct. Some version of Telegram will
    // crash due to the empty value of the text.
    if (value.text) {
      postEvent()('web_app_setup_main_button', {
        is_visible: value.isVisible,
        is_active: value.isActive,
        is_progress_visible: value.isLoaderVisible,
        text: value.text,
        color: value.backgroundColor,
        text_color: value.textColor,
      });
    }
    setStorageValue('mainButton', value);
    s.set(value);
  },
});

/**
 * @see State.backgroundColor
 */
export const backgroundColor = createStateComputed('backgroundColor');

/**
 * @see State.isActive
 */
export const isActive = createStateComputed('isActive');

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
export function onClick(fn: MiniAppsEventListener<'main_button_pressed'>): RemoveEventListenerFn {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the main button click listener.
 * @param fn - an event listener.
 */
export function offClick(fn: MiniAppsEventListener<'main_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Restores the main button state using previously saved one in the local storage.
 */
export function restore(): void {
  state.set(isPageReload() && getStorageValue('mainButton') || initialState);
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
 * @see State.text
 */
export const text = createStateComputed('text');

/**
 * @see State.textColor
 */
export const textColor = createStateComputed('textColor');