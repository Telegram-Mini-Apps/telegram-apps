import type { ThemeParams } from '@telegram-apps/bridge';
import { computed, type Computed, signal } from '@telegram-apps/signals';

import { isColorDark } from '@/utils/isColorDark.js';

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

function fromState<K extends keyof ThemeParams>(key: K): Computed<ThemeParams[K] | undefined> {
  return computed(() => state()[key]);
}

/**
 * @since v6.10
 */
export const accentTextColor = fromState('accentTextColor');

export const backgroundColor = fromState('bgColor');

export const buttonColor = fromState('buttonColor');

export const buttonTextColor = fromState('buttonTextColor');

/**
 * @since v7.10
 */
export const bottomBarBgColor = fromState('bottomBarBgColor');

export const destructiveTextColor = fromState('destructiveTextColor');

/**
 * @since v6.10
 */
export const headerBackgroundColor = fromState('headerBgColor');

export const hintColor = fromState('hintColor');

/**
 * @returns True if the current color scheme is recognized as dark.
 * This value is calculated based on the current theme's background color.
 */
export const isDark = computed(() => {
  const { bgColor } = state();
  return !bgColor || isColorDark(bgColor);
});

export const linkColor = fromState('linkColor');

export const secondaryBackgroundColor = fromState('secondaryBgColor');

/**
 * @since v6.10
 */
export const sectionBackgroundColor = fromState('sectionBgColor');

/**
 * @since v6.10
 */
export const sectionHeaderTextColor = fromState('sectionHeaderTextColor');

/**
 * @since v7.6
 */
export const sectionSeparatorColor = fromState('sectionSeparatorColor');

/**
 * @since v6.10
 */
export const subtitleTextColor = fromState('subtitleTextColor');

export const textColor = fromState('textColor');
