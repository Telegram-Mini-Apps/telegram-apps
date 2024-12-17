import { computed, type Computed, signal } from '@telegram-apps/signals';
import { getStorageValue, type SafeAreaInsets, setStorageValue } from '@telegram-apps/bridge';

import { removeUndefined } from '@/utils/removeUndefined.js';

import { COMPONENT_NAME } from '../const.js';
import type { State } from '../types.js';

const initialInsets: SafeAreaInsets = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
};

function nonNegative(value: number): number {
  return Math.max(value, 0);
}

/**
 * Signal containing the component complete state.
 */
export const state = signal<State>({
  contentSafeAreaInsets: initialInsets,
  height: 0,
  isExpanded: false,
  isFullscreen: false,
  safeAreaInsets: initialInsets,
  stableHeight: 0,
  width: 0,
});

export function signalFromState<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => state()[key]);
}

export function setState(s: Partial<State>) {
  const { height, stableHeight, width } = s;

  state.set({
    ...state(),
    ...removeUndefined({
      ...s,
      height: height ? nonNegative(height) : undefined,
      width: width ? nonNegative(width) : undefined,
      stableHeight: stableHeight ? nonNegative(stableHeight) : undefined,
    }),
  });
  setStorageValue<State>(COMPONENT_NAME, state());
}

export function getStateFromStorage() {
  return getStorageValue<State>(COMPONENT_NAME);
}
