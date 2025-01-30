import type { Computed } from '@telegram-apps/signals';
import type { SafeAreaInsets } from '@telegram-apps/bridge';
import { getStorageValue, setStorageValue } from '@telegram-apps/toolkit';

import { createComputed, createSignalsTuple } from '@/signals-registry.js';
import type { State } from '@/scopes/components/viewport/types.js';
import { removeUndefined } from '@/utils/removeUndefined.js';
import { COMPONENT_NAME } from '@/scopes/components/viewport/const.js';

const initialInsets: SafeAreaInsets = { left: 0, top: 0, bottom: 0, right: 0 };

function nonNegative(value: number): number {
  return Math.max(value, 0);
}

//#region Core State.

/**
 * Signal containing the component complete state.
 */
export const [_state, state] = createSignalsTuple<State>({
  contentSafeAreaInsets: initialInsets,
  height: 0,
  isExpanded: false,
  isFullscreen: false,
  safeAreaInsets: initialInsets,
  stableHeight: 0,
  width: 0,
});

export function signalFromState<K extends keyof State>(key: K): Computed<State[K]> {
  return createComputed(() => state()[key]);
}

/**
 * Signal containing the current height of the **visible area** of the Mini App.
 *
 * The application can display just the top part of the Mini App, with its
 * lower part remaining outside the screen area. From this position, the user
 * can "pull" the Mini App to its maximum height, while the bot can do the same
 * by calling `expand` method. As the position of the Mini App changes, the
 * current height value of the visible area will be updated  in real time.
 *
 * Please note that the refresh rate of this value is not sufficient to
 * smoothly follow the lower border of the window. It should not be used to pin
 * interface elements to the bottom of the visible area. It's more appropriate
 * to use the value of the `stableHeight` field for this purpose.
 *
 * @see stableHeight
 */
export const height = signalFromState('height');

/**
 * Signal containing the height of the visible area of the Mini App in its last stable state.
 *
 * The application can display just the top part of the Mini App, with its
 * lower part remaining outside the screen area. From this position, the user
 * can "pull" the Mini App to its maximum height, while the application can do
 * the same by calling `expand` method.
 *
 * Unlike the value of `height`, the value of `stableHeight` does not change as
 * the position of the Mini App changes with user gestures or during
 * animations. The value of `stableHeight` will be updated after all gestures
 * and animations are completed and the Mini App reaches its final size.
 *
 * @see height
 */
export const stableHeight = signalFromState('stableHeight');

/**
 * Signal containing the currently visible area width.
 */
export const width = signalFromState('width');

/**
 * Signal indicating if the Mini App is expanded to the maximum available height. Otherwise,
 * if the Mini App occupies part of the screen and can be expanded to the full
 * height using `expand` method.
 * @see expand
 */
export const isExpanded = signalFromState('isExpanded');

/**
 * Signal indicating if the current viewport height is stable and is not going to change in
 * the next moment.
 */
export const isStable = createComputed(() => height() === stableHeight());

/**
 * Updates the viewport signal state saving it in the storage.
 * @param s - state updates.
 */
export function setState(s: Partial<State>): void {
  const { height, stableHeight, width } = s;

  _state.set({
    ..._state(),
    ...removeUndefined({
      ...s,
      height: height ? nonNegative(height) : undefined,
      width: width ? nonNegative(width) : undefined,
      stableHeight: stableHeight ? nonNegative(stableHeight) : undefined,
    }),
  });
  setStorageValue<State>(COMPONENT_NAME, _state());
}

/**
 * Retrieves the viewport state from the storage.
 */
export function getStateFromStorage(): State | undefined {
  return getStorageValue<State>(COMPONENT_NAME);
}

//#endregion

//#region Content Safe Area Insets.

function fromCsaState(key: keyof SafeAreaInsets): Computed<number> {
  return createComputed(() => contentSafeAreaInsets()[key]);
}

export const contentSafeAreaInsets = signalFromState('contentSafeAreaInsets');
export const contentSafeAreaInsetBottom = fromCsaState('bottom');
export const contentSafeAreaInsetLeft = fromCsaState('left');
export const contentSafeAreaInsetRight = fromCsaState('right');
export const contentSafeAreaInsetTop = fromCsaState('top');

//#endregion

//#region Safe Area Insets.

function fromSaState(key: keyof SafeAreaInsets): Computed<number> {
  return createComputed(() => safeAreaInsets()[key]);
}

export const safeAreaInsets = signalFromState('safeAreaInsets');
export const safeAreaInsetBottom = fromSaState('bottom');
export const safeAreaInsetLeft = fromSaState('left');
export const safeAreaInsetRight = fromSaState('right');
export const safeAreaInsetTop = fromSaState('top');

//#endregion