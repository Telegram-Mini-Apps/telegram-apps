import { postEvent } from '@/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { computed } from '@/signals/computed/computed.js';

import * as _ from './swipeBehavior.private.js';
import { decorateWithSupports, WithSupports } from '@/components/decorateWithSupports.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/swipe-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/swipe-behavior
 */

const MINI_APPS_METHOD = 'web_app_setup_swipe_behavior';
const STORAGE_KEY = 'swipeBehavior';

/**
 * True if vertical swipes are enabled.
 */
const isVerticalSwipesEnabled = computed(_.isVerticalSwipesEnabled);

/**
 * True if the component is currently mounted.
 */
const isMounted = computed(_.isMounted);

/**
 * Disables vertical swipes.
 */
const disableVerticalSwipes: WithSupports<() => void> = decorateWithSupports(() => {
  _.isVerticalSwipesEnabled.set(false);
}, MINI_APPS_METHOD);

/**
 * Enables vertical swipes.
 */
const enableVerticalSwipes: WithSupports<() => void> = decorateWithSupports(() => {
  _.isVerticalSwipesEnabled.set(true);
}, MINI_APPS_METHOD);

/**
 * Mounts the component.
 */
function mount(): void {
  if (!_.isMounted()) {
    _.isVerticalSwipesEnabled.set(isPageReload() && getStorageValue(STORAGE_KEY) || false);
    _.isVerticalSwipesEnabled.sub(onStateChanged);
    _.isMounted.set(true);
  }
}

function onStateChanged(value: boolean): void {
  postEvent()(MINI_APPS_METHOD, { allow_vertical_swipe: value });
  setStorageValue(STORAGE_KEY, value);
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  _.isVerticalSwipesEnabled.unsub(onStateChanged);
  _.isMounted.set(false);
}

export {
  disableVerticalSwipes,
  enableVerticalSwipes,
  isMounted,
  isVerticalSwipesEnabled,
  mount,
  unmount,
};
