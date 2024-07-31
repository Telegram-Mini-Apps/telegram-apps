import { computed, type Computed } from '@/signals/computed/computed.js';

import * as _ from './private.js';
import type { State } from './types.js';

function createStateComputed<K extends keyof State>(key: K): Computed<State[K]> {
  return computed(() => _.state()[key]);
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
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * @see State.isLoaderVisible
 */
export const isLoaderVisible = createStateComputed('isLoaderVisible');

/**
 * @see State.isVisible
 */
export const isVisible = createStateComputed('isVisible');

/**
 * Complete component state.
 */
export const state = computed(_.state);

/**
 * @see State.text
 */
export const text = createStateComputed('text');

/**
 * @see State.textColor
 */
export const textColor = createStateComputed('textColor');
