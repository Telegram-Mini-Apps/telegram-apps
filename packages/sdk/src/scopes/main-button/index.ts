import { postEvent } from '@/scopes/globals/globals.js';
import { off, on } from '@/bridge/events/listening.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import * as themeParams from '@/scopes/theme-params/themeParams.js';
import type { RemoveEventListenerFn } from '@/events/types.js';
import type { EventListener } from '@/bridge/events/types.js';

import * as _ from './private.js';
import type { State } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/main-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/main-button
 */

const CLICK_EVENT = 'main_button_pressed';
const STORAGE_KEY = 'mainButton';

/**
 * Add a new main button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
function onClick(fn: EventListener<'main_button_pressed'>): RemoveEventListenerFn {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the main button click listener.
 * @param fn - an event listener.
 */
function offClick(fn: EventListener<'main_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Mounts the component.
 */
function mount(): void {
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
    postEvent()('web_app_setup_main_button', {
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
 * Updates the main button state.
 * @param updates - state changes to perform.
 */
function setParams(updates: Partial<State>): void {
  _.state.set({
    ..._.state(),
    ...Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    ),
  });
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  _.state.unsub(onStateChanged);
  _.isMounted.set(false);
}

export {
  mount,
  onClick,
  offClick,
  setParams,
  unmount,
};
export {
  backgroundColor,
  isMounted,
  isActive,
  isVisible,
  isLoaderVisible,
  state,
  text,
  textColor,
} from './computed.js';
