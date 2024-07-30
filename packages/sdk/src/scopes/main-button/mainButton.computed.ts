import { computed, type Computed } from '@/signals/computed/computed.js';

import { state } from './mainButton.private.js';
import type { State } from './types.js';

function createStateComputed<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => state()[key]);
}

/**
 * @see State.backgroundColor
 */
export const backgroundColor = createStateComputed('backgroundColor');

/**
 * @see State.isActive
 */
export const isActive = createStateComputed('isActive');

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