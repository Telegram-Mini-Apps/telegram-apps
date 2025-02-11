import type { ThemeParams } from '@telegram-apps/types';
import type { Computed } from '@telegram-apps/signals';

import { isColorDark } from '@/utils/isColorDark.js';
import { createComputed, createSignalsTuple } from '@/signals-registry.js';

/**
 * True if CSS variables are currently bound.
 */
export const [_isCssVarsBound, isCssVarsBound] = createSignalsTuple(false);

/**
 * Complete component state.
 */
export const [_state, state] = createSignalsTuple<ThemeParams>({});

function fromState<K extends keyof ThemeParams>(key: K): Computed<ThemeParams[K] | undefined> {
  return createComputed(() => _state()[key]);
}

/**
 * @since v6.10
 */
export const accentTextColor = fromState('accent_text_color');

export const backgroundColor = fromState('bg_color');

export const buttonColor = fromState('button_color');

export const buttonTextColor = fromState('button_text_color');

/**
 * @since v7.10
 */
export const bottomBarBgColor = fromState('bottom_bar_bg_color');

export const destructiveTextColor = fromState('destructive_text_color');

/**
 * @since v6.10
 */
export const headerBackgroundColor = fromState('header_bg_color');

export const hintColor = fromState('hint_color');

/**
 * @returns True if the current color scheme is recognized as dark.
 * This value is calculated based on the current theme's background color.
 */
export const isDark = createComputed(() => {
  const color = backgroundColor();
  return !color || isColorDark(color);
});

export const linkColor = fromState('link_color');

export const secondaryBackgroundColor = fromState('secondary_bg_color');

/**
 * @since v6.10
 */
export const sectionBackgroundColor = fromState('section_bg_color');

/**
 * @since v6.10
 */
export const sectionHeaderTextColor = fromState('section_header_text_color');

/**
 * @since v7.6
 */
export const sectionSeparatorColor = fromState('section_separator_color');

/**
 * @since v6.10
 */
export const subtitleTextColor = fromState('subtitle_text_color');

export const textColor = fromState('text_color');
