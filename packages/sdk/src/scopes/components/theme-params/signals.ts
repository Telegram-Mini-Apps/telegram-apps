import type { ThemeParams } from '@telegram-apps/bridge';
import { computed, type Computed, signal } from '@telegram-apps/signals';

import { isColorDark } from '@/utils/isColorDark.js';

/* USUAL */

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);

/**
 * Complete component state.
 */
export const state = signal<ThemeParams>({});

/* COMPUTED */

function createStateComputed<K extends keyof ThemeParams>(key: K): Computed<ThemeParams[K] | undefined> {
  return computed(() => state()[key]);
}

/**
 * @since v6.10
 */
export const accentTextColor = createStateComputed('accentTextColor');

export const backgroundColor = createStateComputed('bgColor');

export const buttonColor = createStateComputed('buttonColor');

export const buttonTextColor = createStateComputed('buttonTextColor');

export const bottomBarBgColor = createStateComputed('bottomBarBgColor');

export const destructiveTextColor = createStateComputed('destructiveTextColor');

/**
 * @since v6.10
 */
export const headerBackgroundColor = createStateComputed('headerBgColor');

export const hintColor = createStateComputed('hintColor');

/**
 * @returns True if the current color scheme is recognized as dark.
 * This value is calculated based on the current theme's background color.
 */
export const isDark = computed(() => {
  const { bgColor } = state();
  return !bgColor || isColorDark(bgColor);
});

export const linkColor = createStateComputed('linkColor');

export const secondaryBackgroundColor = createStateComputed('secondaryBgColor');

/**
 * @since v6.10
 */
export const sectionBackgroundColor = createStateComputed('sectionBgColor');

/**
 * @since v6.10
 */
export const sectionHeaderTextColor = createStateComputed('sectionHeaderTextColor');

/**
 * @since v7.6
 */
export const sectionSeparatorColor = createStateComputed('sectionSeparatorColor');

/**
 * @since v6.10
 */
export const subtitleTextColor = createStateComputed('subtitleTextColor');

export const textColor = createStateComputed('textColor');
