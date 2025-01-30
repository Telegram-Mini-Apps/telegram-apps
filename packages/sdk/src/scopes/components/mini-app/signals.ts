import type { Computed } from '@telegram-apps/signals';
import { isRGB } from '@telegram-apps/transformers';
import type { BackgroundColor, BottomBarColor } from '@telegram-apps/bridge';
import type { RGB } from '@telegram-apps/types';

import { isColorDark } from '@/utils/isColorDark.js';
import {
  backgroundColor as themeBgColor,
  secondaryBackgroundColor as themeSecondaryBgColor,
  bottomBarBgColor as themeBottomBarBgColor,
} from '@/scopes/components/theme-params/signals.js';
import { createComputed, createSignalsTuple } from '@/signals-registry.js';

import type { HeaderColor, State } from './types.js';

// #__NO_SIDE_EFFECTS__
function rgbBasedOn(signal: Computed<'bg_color' | 'secondary_bg_color' | RGB>) {
  return createComputed<RGB | undefined>(() => {
    const color = signal();

    return isRGB(color) ? color : color === 'bg_color'
      ? themeBgColor()
      : themeSecondaryBgColor();
  });
}

/**
 * The Mini App background color.
 */
export const [_backgroundColor, backgroundColor] =
  createSignalsTuple<BackgroundColor>('bg_color');

/**
 * RGB representation of the background color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const backgroundColorRGB = rgbBasedOn(_backgroundColor);


/**
 * The Mini App bottom bar background color.
 */
export const [_bottomBarColor, bottomBarColor] =
  createSignalsTuple<BottomBarColor>('bottom_bar_bg_color');

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
    : color === 'bottom_bar_bg_color'
      // Following the logic from the Telegram SDK.
      // I removed "|| '#ffffff'" because this seems too strange to me. This is just not right.
      ? themeBottomBarBgColor() || themeSecondaryBgColor()
      : color === 'secondary_bg_color'
        ? themeSecondaryBgColor()
        : themeBgColor();
});

/**
 * The Mini App header color.
 */
export const [_headerColor, headerColor] = createSignalsTuple<HeaderColor>('bg_color');

/**
 * RGB representation of the header color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const headerColorRGB = rgbBasedOn(_headerColor);

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
