import { isRGB } from '@telegram-apps/transformers';
import type { RGB } from '@telegram-apps/types';

import { isColorDark } from '@/utils/isColorDark.js';
import {
  secondaryBackgroundColor as themeSecondaryBgColor,
  state as themeParamsState,
} from '@/scopes/components/theme-params/signals.js';
import { createComputed, createSignalsTuple } from '@/signals-registry.js';
import { rgbComputedBasedOn } from './utils.js';

import type { AnyColor, State } from './types.js';

/**
 * The Mini App background color.
 *
 * Represents an RGB color, or theme parameters key, like "bg_color", "secondary_bg_color", etc.
 *
 * Note that using a theme parameters key, background color becomes bound to the current
 * theme parameters, making it automatically being updated whenever theme parameters change.
 * In order to remove this bind, use an explicit RGB color.
 */
export const [_backgroundColor, backgroundColor] = createSignalsTuple<AnyColor>('bg_color');

/**
 * RGB representation of the background color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const backgroundColorRGB = rgbComputedBasedOn(_backgroundColor);


/**
 * The Mini App bottom bar background color.
 */
export const [_bottomBarColor, bottomBarColor] = createSignalsTuple<AnyColor>('bottom_bar_bg_color');

/**
 * RGB representation of the bottom bar background color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const bottomBarColorRGB = createComputed<RGB | undefined>(() => {
  const color = _bottomBarColor();
  return isRGB(color)
    ? color
    // Falling back to secondary_bg_color following the logic from the Telegram SDK.
    : themeParamsState()[color] || themeSecondaryBgColor();
});

/**
 * The Mini App header color.
 */
export const [_headerColor, headerColor] = createSignalsTuple<AnyColor>('bg_color');

/**
 * RGB representation of the header color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const headerColorRGB = rgbComputedBasedOn(_headerColor);

/**
 * True if CSS variables are currently bound.
 */
export const [_isCssVarsBound, isCssVarsBound] = createSignalsTuple(false);

/**
 * True if the current Mini App background color is recognized as dark.
 */
export const isDark = createComputed(() => {
  const color = backgroundColorRGB();
  return color ? isColorDark(color) : false;
});

/**
 * Signal indicating if the mini app is currently active.
 */
export const [_isActive, isActive] = createSignalsTuple(true);

/**
 * Complete component state.
 */
export const state = createComputed<State>(() => ({
  backgroundColor: _backgroundColor(),
  bottomBarColor: _bottomBarColor(),
  headerColor: _headerColor(),
  isActive: _isActive(),
}));
