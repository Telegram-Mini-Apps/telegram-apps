import { computed, type Computed, signal } from '@telegram-apps/signals';

import type { State } from './types.js';

/* USUAL */

/**
 * Complete component state.
 */
export const state = signal<State>({
  backgroundColor: '#2481cc',
  hasShineEffect: false,
  isEnabled: true,
  isLoaderVisible: false,
  isVisible: false,
  text: 'Continue',
  textColor: '#ffffff',
});

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/* COMPUTED */

function createStateComputed<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => state()[key]);
}

/**
 * @see State.backgroundColor
 */
export const backgroundColor = createStateComputed('backgroundColor');

/**
 * @see State.hasShineEffect
 */
export const hasShineEffect = createStateComputed('hasShineEffect');

/**
 * @see State.isEnabled
 */
export const isEnabled = createStateComputed('isEnabled');

/**
 * @see State.isLoaderVisible
 */
export const isLoaderVisible = createStateComputed('isLoaderVisible');

/**
 * @see State.isVisible
 */
export const isVisible = createStateComputed('isVisible');

/**
 * @see State.text
 */
export const text = createStateComputed('text');

/**
 * @see State.textColor
 */
export const textColor = createStateComputed('textColor');
