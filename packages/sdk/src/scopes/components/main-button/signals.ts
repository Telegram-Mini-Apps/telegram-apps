import { computed, type Computed, signal } from '@telegram-apps/signals';

import { buttonColor, buttonTextColor } from '@/scopes/components/theme-params/signals.js';

import type { State } from './types.js';

function fromState<K extends keyof Required<State>>(key: K): Computed<Required<State>[K]> {
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
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * @see State.backgroundColor
 */
export const backgroundColor = fromState('backgroundColor');

/**
 * @see State.hasShineEffect
 */
export const hasShineEffect = fromState('hasShineEffect');

/**
 * @see State.isEnabled
 */
export const isEnabled = fromState('isEnabled');

/**
 * @see State.isLoaderVisible
 */
export const isLoaderVisible = fromState('isLoaderVisible');

/**
 * @see State.isVisible
 */
export const isVisible = fromState('isVisible');

/**
 * @see State.text
 */
export const text = fromState('text');

/**
 * @see State.textColor
 */
export const textColor = fromState('textColor');
