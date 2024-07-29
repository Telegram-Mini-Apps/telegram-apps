import { postEvent } from '@/components/globals.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { decorateWithSupports } from '@/components/decorateWithSupports.js';
import { signal } from '@/signals/signal/signal.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/swipe-behavior
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/swipe-behavior
 */

const MINI_APPS_METHOD = 'web_app_setup_swipe_behavior';

/**
 * Signal containing true, if the vertical swipe is enabled.
 */
export const isVerticalSwipeEnabled = signal(false, {
  set(s, value) {
    if (s() !== value) {
      postEvent()(MINI_APPS_METHOD, { allow_vertical_swipe: value });
      setStorageValue('swipeBehavior', { isVerticalSwipeEnabled: value });
    }
    s.set(value);
  },
});

/**
 * Disables the vertical swipe.
 */
export const disableVerticalSwipe = decorateWithSupports((): void => {
  isVerticalSwipeEnabled.set(false);
}, MINI_APPS_METHOD);

/**
 * Enables the vertical swipe.
 */
export const enableVerticalSwipe = decorateWithSupports((): void => {
  isVerticalSwipeEnabled.set(true);
}, MINI_APPS_METHOD);

/**
 * Restores the component state.
 */
export function restore(): void {
  isVerticalSwipeEnabled.set(
    (isPageReload() && getStorageValue('swipeBehavior') || { isVerticalSwipeEnabled: false }).isVerticalSwipeEnabled,
  );
}
