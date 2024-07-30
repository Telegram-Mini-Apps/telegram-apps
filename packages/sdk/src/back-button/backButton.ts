import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { decorateWithSupports, type WithSupports } from '@/components/decorateWithSupports.js';
import { postEvent } from '@/globals/globals.js';
import { computed } from '@/signals/computed/computed.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

import { isVisible as _isVisible, isMounted as _isMounted } from './backButton.private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/back-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/back-button
 */

const MINI_APPS_METHOD = 'web_app_setup_back_button';
const CLICK_EVENT = 'back_button_pressed';

/**
 * Hides the back button.
 */
const hide: WithSupports<() => void> = decorateWithSupports(() => {
  _isVisible.set(false);
}, MINI_APPS_METHOD);

/**
 * True if the component is currently visible.
 */
const isVisible = computed(_isVisible);

/**
 * True if the component is currently mounted.
 */
const isMounted = computed(_isMounted);

/**
 * Mounts the component.
 */
function mount(): void {
  if (!isMounted()) {
    _isVisible.set(isPageReload() && getStorageValue('backButton') || false);
    _isVisible.sub(onStateChanged);
    _isMounted.set(true);
  }
}

function onStateChanged(isVisible: boolean) {
  postEvent()(MINI_APPS_METHOD, { is_visible: isVisible });
  setStorageValue('backButton', isVisible);
}

/**
 * Add a new back button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
function onClick(fn: MiniAppsEventListener<'back_button_pressed'>): RemoveEventListenerFn {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the back button click listener.
 * @param fn - an event listener.
 */
function offClick(fn: MiniAppsEventListener<'back_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Shows the back button.
 */
const show: WithSupports<() => void> = decorateWithSupports(() => {
  _isVisible.set(true);
}, MINI_APPS_METHOD);

/**
 * Unmounts the component.
 */
function unmount() {
  _isVisible.unsub(onStateChanged);
  _isMounted.set(false);
}

export {
  hide,
  isVisible,
  isMounted,
  mount,
  onClick,
  offClick,
  show,
  unmount,
};