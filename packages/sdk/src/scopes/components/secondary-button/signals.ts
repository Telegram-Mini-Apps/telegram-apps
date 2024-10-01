import { computed, type Computed, signal } from '@telegram-apps/signals';

import type { State } from './types.js';

/**
 * Complete component state.
 */
export const state = signal<State>({
  backgroundColor: '#000000',
  hasShineEffect: false,
  isEnabled: true,
  isLoaderVisible: false,
  isVisible: false,
  position: 'left',
  text: 'Cancel',
  textColor: '#2481cc',
});

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

function fromState<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => state()[key]);
}

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
 * @see State.position
 */
export const position = fromState('position');

/**
 * @see State.text
 */
export const text = fromState('text');

/**
 * @see State.textColor
 */
export const textColor = fromState('textColor');
