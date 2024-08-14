import { computed } from '@telegram-apps/signals';
import { isPageReload } from '@telegram-apps/navigation';

import { $postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';

import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/swipe-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/swipe-behavior
 */

const MINI_APPS_METHOD = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * Disables vertical swipes.
 */
export const disableVerticalSwipes: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  _.isVerticalSwipesEnabled.set(false);
}, MINI_APPS_METHOD);

/**
 * Enables vertical swipes.
 */
export const enableVerticalSwipes: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  _.isVerticalSwipesEnabled.set(true);
}, MINI_APPS_METHOD);

/**
 * True if vertical swipes are enabled.
 */
export const isVerticalSwipesEnabled = computed(_.isVerticalSwipesEnabled);

/**
 * True if the component is currently mounted.
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
    _.isVerticalSwipesEnabled.set(isPageReload() && getStorageValue(STORAGE_KEY) || false);
    _.isVerticalSwipesEnabled.sub(onStateChanged);
    _.isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  $postEvent()(MINI_APPS_METHOD, { allow_vertical_swipe: value });
  setStorageValue(STORAGE_KEY, value);
}

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  _.isVerticalSwipesEnabled.unsub(onStateChanged);
  _.isMounted.set(false);
}
