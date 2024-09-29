import { computed, signal } from '@telegram-apps/signals';
import type { RGB } from '@telegram-apps/bridge';

import { isColorDark } from '@/utils/isColorDark.js';

import type { HeaderColor, State } from './types.js';

/* USUAL */

/**
 * The Mini App background color.
 * @example "#ffaabb"
 */
export const backgroundColor = signal<RGB>('#000000');

/**
 * The Mini App header color.
 * @example "#ffaabb"
 * @example "bg_color"
 */
export const headerColor = signal<HeaderColor>('bg_color');

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);

/* COMPUTED */

/**
 * True if the current Mini App background color is recognized as dark.
 */
export const isDark = computed(() => isColorDark(backgroundColor()));

/**
 * Complete component state.
 */
export const state = computed<State>(() => ({
  backgroundColor: backgroundColor(),
  headerColor: headerColor(),
}));
