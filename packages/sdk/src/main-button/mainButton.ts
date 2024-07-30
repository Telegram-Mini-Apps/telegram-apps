import { postEvent } from '@/globals/globals.js';
import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { computed } from '@/signals/computed/computed.js';
import * as themeParams from '@/theme-params/themeParams.js';
import type { RemoveEventListenerFn } from '@/events/types.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';

import { state as _state, isMounted as _isMounted } from './mainButton.private.js';
import type { State } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/main-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/main-button
 */

const CLICK_EVENT = 'main_button_pressed';

const isMounted = computed(_isMounted);

/**
 * Current complete main button state.
 */
const state = computed(_state);

/**
 * Add a new main button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
function onClick(fn: MiniAppsEventListener<'main_button_pressed'>): RemoveEventListenerFn {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the main button click listener.
 * @param fn - an event listener.
 */
function offClick(fn: MiniAppsEventListener<'main_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Mounts the component.
 */
function mount(): void {
  if (!_isMounted()) {
    const prev = isPageReload() && getStorageValue('mainButton');
    if (prev) {
      _state.set(prev);
    } else {
      themeParams.mount();
      setParams({
        backgroundColor: themeParams.buttonColor(),
        textColor: themeParams.buttonTextColor(),
      });
    }

    _state.sub(onStateChanged);
    _isMounted.set(true);
  }
}

function onStateChanged(s: State): void {
  // We should not commit changes until the payload is correct. Some version of Telegram will
  // crash due to the empty value of the text.
  if (s.text) {
    postEvent()('web_app_setup_main_button', {
      is_visible: s.isVisible,
      is_active: s.isActive,
      is_progress_visible: s.isLoaderVisible,
      text: s.text,
      color: s.backgroundColor,
      text_color: s.textColor,
    });
  }
  setStorageValue('mainButton', s);
}

/**
 * Updates the main button state.
 * @param updates - state changes to perform.
 */
function setParams(updates: Partial<State>): void {
  _state.set({
    ...state(),
    ...Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    ),
  });
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  _state.unsub(onStateChanged);
  _isMounted.set(false);
}

export {
  isMounted,
  mount,
  onClick,
  offClick,
  setParams,
  state,
  unmount,
};

export * from './mainButton.computed.js';
