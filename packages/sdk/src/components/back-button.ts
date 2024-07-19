import { signal } from '@/reactivity/signal.js';
import { postEvent } from '@/components/globals.js';
import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { decorateWithSupports } from '@/components/utilities/decorateWithSupports.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';
import type { RemoveEventListenerFn } from '@/events/types.js';
import type { CleanupFn } from '@/types/index.js';

const [
  isVisible,
  _setIsVisible,
  trackIsVisible,
  untrackIsVisible,
  untrackAllIsVisible,
] = signal(false);

const [
  isMounted,
  setIsMounted,
  trackIsMounted,
  untrackIsMounted,
  untrackAllIsMounted,
] = signal(false);

/**
 * Saves the back button state into the local storage.
 */
function onStateChanged(): void {
  setStorageValue('backButton', { isVisible: isVisible() });
}

export {
  /**
   * Returns true, if the back button is currently visible.
   */
    isVisible,
  /**
   * Adds a new listener tracking the back button visibility changes.
   */
    trackIsVisible,
  /**
   * Removes a listener tracking the back button visibility changes.
   */
    untrackIsVisible,
  /**
   * Removes all listeners tracking the back button visibility changes.
   */
    untrackAllIsVisible,
};

export {
  /**
   * Returns true, if the back button was mounted.
   */
    isMounted,
  /**
   * Adds a new listener tracking the back button mount state changes.
   */
    trackIsMounted,
  /**
   * Removes a listener tracking the back button mount changes.
   */
    untrackIsMounted,
  /**
   * Removes all listeners tracking the back button mount changes.
   */
    untrackAllIsMounted,
};

/**
 * Hides the back button.
 */
export const hide = decorateWithSupports((): void => {
  setIsVisible(false);
}, 'web_app_setup_back_button');

/**
 * Initializes the back button.
 */
export function mount(): CleanupFn {
  // TODO: batch
  _setIsVisible(
    (isPageReload() && getStorageValue('backButton') || { isVisible: false }).isVisible,
  );
  setIsMounted(true);
  trackIsVisible(onStateChanged);

  return unmount;
}

/**
 * Add a new back button click listener. Returns a function to remove the listener.
 * @param fn - event listener.
 */
export function onClick(fn: MiniAppsEventListener<'back_button_pressed'>): RemoveEventListenerFn {
  return on('back_button_pressed', fn);
}

/**
 * Removes the back button click listener.
 * @param fn - event listener.
 */
export function offClick(fn: MiniAppsEventListener<'back_button_pressed'>): void {
  return off('back_button_pressed', fn);
}

/**
 * Shows the back button.
 */
export const show = decorateWithSupports((): void => {
  setIsVisible(true);
}, 'web_app_setup_back_button');

/**
 * Updates the back button visibility state.
 * @param value - should the back button be visible.
 */
export function setIsVisible(value: boolean): void {
  if (isVisible() !== value) {
    _setIsVisible(value);
    postEvent()('web_app_setup_back_button', { is_visible: value });
  }
}

/**
 * Unmounts the back button.
 */
export function unmount(): void {
  // TODO: batch
  setIsVisible(false);
  setIsMounted(false);
  untrackAllIsVisible();
  untrackAllIsMounted();
}
