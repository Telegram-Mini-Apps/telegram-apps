import { Computed, computed, signal } from '@telegram-apps/signals';
import { isRGB } from '@telegram-apps/transformers';
import type { BackgroundColor, BottomBarColor, RGB } from '@telegram-apps/bridge';

import { isColorDark } from '@/utils/isColorDark.js';
import {
  backgroundColor as themeBgColor,
  secondaryBackgroundColor as themeSecondaryBgColor,
  bottomBarBgColor as themeBottomBarBgColor,
} from '@/scopes/components/theme-params/signals.js';

import type { HeaderColor, State } from './types.js';

// #__NO_SIDE_EFFECTS__
function rgbBasedOn(signal: Computed<'bg_color' | 'secondary_bg_color' | RGB>) {
  return computed<RGB | undefined>(() => {
    const color = signal();

    return isRGB(color) ? color : color === 'bg_color'
      ? themeBgColor()
      : themeSecondaryBgColor();
  });
}

/**
 * The Mini App background color.
 */
export const backgroundColor = signal<BackgroundColor>('bg_color');

/**
 * RGB representation of the background color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const backgroundColorRGB = rgbBasedOn(backgroundColor);


/**
 * The Mini App bottom bar background color.
 */
export const bottomBarColor = signal<BottomBarColor>('bottom_bar_bg_color');

/**
 * RGB representation of the bottom bar background color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const bottomBarColorRGB = computed<RGB | undefined>(() => {
  const color = bottomBarColor();
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
export const headerColor = signal<HeaderColor>('bg_color');

/**
 * RGB representation of the header color.
 *
 * This value requires the Theme Params component to be mounted to extract a valid RGB value
 * of the color key.
 */
export const headerColorRGB = rgbBasedOn(headerColor);

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);

/**
 * True if the current Mini App background color is recognized as dark.
 */
export const isDark = computed(() => {
  const color = backgroundColorRGB();
  return color ? isColorDark(color) : false;
});

/**
 * Complete component state.
 */
export const state = computed<State>(() => ({
  backgroundColor: backgroundColor(),
  bottomBarColor: bottomBarColor(),
  headerColor: headerColor(),
}));
