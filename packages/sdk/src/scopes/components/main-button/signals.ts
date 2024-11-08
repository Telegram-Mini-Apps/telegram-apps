import { computed, type Computed, signal } from '@telegram-apps/signals';

import {
  buttonColor,
  buttonTextColor,
} from '@/scopes/components/theme-params/signals.js';

import type { State } from './types.js';

function fromState<K extends keyof Required<State>>(
  key: K,
): Computed<Required<State>[K]> {
  return computed(() => state()[key]);
}

export const internalState = signal<State>({
  hasShineEffect: false,
  isEnabled: true,
  isLoaderVisible: false,
  isVisible: false,
  text: 'Continue',
});

/**
 * Complete component state.
 */
export const state = computed<Required<State>>(() => {
  const s = internalState();
  return {
    ...s,
    backgroundColor: s.backgroundColor || buttonColor() || '#2481cc',
    textColor: s.textColor || buttonTextColor() || '#ffffff',
  };
});

/**
 * Signal indicating if the Main Button is currently mounted.
 */
export const isMounted = signal(false);

/**
 * Signal containing the current Main Button background color.
 */
export const backgroundColor = fromState('backgroundColor');

/**
 * Signal indicating if the Main Button has a shining effect.
 */
export const hasShineEffect = fromState('hasShineEffect');

/**
 * Signal indicating if the Main Button is currently active and can be clicked.
 */
export const isEnabled = fromState('isEnabled');

/**
 * Signal indicating if the Main Button displays a loader inside it.
 */
export const isLoaderVisible = fromState('isLoaderVisible');

/**
 * Signal indicating if the Main Button is currently visible.
 */
export const isVisible = fromState('isVisible');

/**
 * Signal containing the Main Button text.
 */
export const text = fromState('text');

/**
 * Signal containing the current Main Button text color.
 */
export const textColor = fromState('textColor');
