import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { isColorDark } from '@/colors/isColorDark.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { signal } from '@/signals/signal/signal.js';
import { computed, type Computed } from '@/signals/computed/computed.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';

import { parse } from './ThemeParams.static.js';
import type { ThemeParams } from './types.js';

/**
 * @see Usage: https://docs.telegram-mini-apps.com/platform/theming
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/theme-params
 */


function createStateComputed<K extends keyof ThemeParams>(
  key: K,
): Computed<ThemeParams[K] | undefined> {
  return computed(() => state()[key]);
}

export const state = signal<ThemeParams>({}, {
  set(s, value) {
    setStorageValue('themeParams', value);
    s.set(value);
  },
});

/**
 * @since v6.10
 */
export const accentTextColor = createStateComputed('accentTextColor')

export const backgroundColor = createStateComputed('bgColor')

export const buttonColor = createStateComputed('buttonColor')

export const buttonTextColor = createStateComputed('buttonTextColor')

export const destructiveTextColor = createStateComputed('destructiveTextColor');

/**
 * @since v6.10
 */
export const headerBackgroundColor = createStateComputed('headerBgColor')

export const hintColor = createStateComputed('hintColor');

/**
 * @returns True if the current color scheme is recognized as dark.
 * This value is calculated based on the current theme's background color.
 */
export const isDark = computed(() => {
  const { bgColor } = state();
  return !bgColor || isColorDark(bgColor);
});

/**
 * Boolean signal, containing `true` if the component is currently mounted.
 */
export const isMounted = signal(false);

export const linkColor = createStateComputed('linkColor');

/**
 * Mounts the component restoring its state and adding special event listeners, actualizing
 * the component state.
 */
export function mount(): void {
  if (!isMounted()) {
    state.set(isPageReload() && getStorageValue('themeParams') || retrieveLaunchParams().themeParams);
    on('theme_changed', onThemeChanged);
    isMounted.set(true);
  }
}

/**
 * Actualizes the theme parameters whenever an according event was received.
 * @param e - event data.
 */
const onThemeChanged: MiniAppsEventListener<'theme_changed'> = (e) => {
  state.set(parse(e.theme_params));
};

export const secondaryBackgroundColor = createStateComputed('secondaryBgColor');

/**
 * @since v6.10
 */
export const sectionBackgroundColor = createStateComputed('sectionBgColor');

/**
 * @since v6.10
 */
export const sectionHeaderTextColor = createStateComputed('sectionHeaderTextColor')

/**
 * @since v7.6
 */
export const sectionSeparatorColor = createStateComputed('sectionSeparatorColor');

/**
 * @since v6.10
 */
export const subtitleTextColor = createStateComputed('subtitleTextColor');

export const textColor = createStateComputed('textColor');

/**
 * Unmounts the component removing all bound event listeners.
 */
export function unmount(): void {
  if (isMounted()) {
    off('theme_changed', onThemeChanged);
    isMounted.set(false);
  }
}
