import { off, on, type EventListener } from '@telegram-apps/bridge';
import { computed } from '@telegram-apps/signals';
import { isPageReload } from '@telegram-apps/navigation';
import type { VoidFn } from '@telegram-apps/util-types';

import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { $postEvent } from '@/scopes/globals/globals.js';

import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/back-button
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/back-button
 */

const MINI_APPS_METHOD = 'web_app_setup_back_button';
const CLICK_EVENT = 'back_button_pressed';
const STORAGE_KEY = 'backButton';

/**
 * Hides the back button.
 */
export const hide: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  _.isVisible.set(false);
}, MINI_APPS_METHOD);

/**
 * True if the component is currently visible.
 */
export const isVisible = computed(_.isVisible);

/**
 * True if the component is currently mounted.
 * @see mount
 * @see unmount
 */
export const isMounted = computed(_.isMounted);

/**
 * Mounts the component.
 * 
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!_.isMounted()) {
    _.isVisible.set(isPageReload() && getStorageValue(STORAGE_KEY) || false);
    _.isVisible.sub(onStateChanged);
    _.isMounted.set(true);
  }
}

export function onStateChanged(isVisible: boolean) {
  $postEvent()(MINI_APPS_METHOD, { is_visible: isVisible });
  setStorageValue(STORAGE_KEY, isVisible);
}

/**
 * Add a new back button click listener.
 * @param fn - event listener.
 * @returns A function to remove bound listener.
 */
export function onClick(fn: EventListener<'back_button_pressed'>): VoidFn {
  return on(CLICK_EVENT, fn);
}

/**
 * Removes the back button click listener.
 * @param fn - an event listener.
 */
export function offClick(fn: EventListener<'back_button_pressed'>): void {
  off(CLICK_EVENT, fn);
}

/**
 * Shows the back button.
 */
export const show: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  _.isVisible.set(true);
}, MINI_APPS_METHOD);

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 *
 * Note that this function does not remove listeners, added via the `onClick` function.
 * @see onClick
 */
export function unmount() {
  _.isVisible.unsub(onStateChanged);
  _.isMounted.set(false);
}
