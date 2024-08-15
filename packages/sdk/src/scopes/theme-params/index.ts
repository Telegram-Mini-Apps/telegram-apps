import {
  off,
  on,
  type EventListener,
  type RGB,
  type ThemeParams,
} from '@telegram-apps/bridge';
import { computed, type Computed } from '@telegram-apps/signals';
import { isPageReload } from '@telegram-apps/navigation';
import type { VoidFn } from '@telegram-apps/util-types';

import { isColorDark } from '@/utils/isColorDark.js';
import { retrieveLaunchParams } from '@/scopes/launch-params/retrieveLaunchParams.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import { createError } from '@/errors/createError.js';
import { ERR_CSS_VARS_BOUND } from '@/errors/errors.js';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';
import { camelToKebab } from '@/utils/casing.js';

import { type GetCssVarNameFn, parse } from './static.js';
import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/theming
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/theme-params
 */

const STORAGE_KEY = 'themeParams';
const THEME_CHANGED_EVENT = 'theme_changed';

function createStateComputed<K extends keyof ThemeParams>(key: K): Computed<ThemeParams[K] | undefined> {
  return computed(() => _.state()[key]);
}

/**
 * Creates CSS variables connected with the current theme parameters.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab case.
 *
 * Default variables:
 * - `--tg-theme-bg-color`
 * - `--tg-theme-secondary-text-color`
 *
 * Variables are being automatically updated if theme parameters were changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * theme parameters key.
 * @returns Function to stop updating variables.
 */
export function bindCssVars(getCSSVarName?: GetCssVarNameFn): VoidFn {
  if (_.isCssVarsBound()) {
    throw createError(ERR_CSS_VARS_BOUND);
  }
  getCSSVarName ||= (prop) => `--tg-theme-${camelToKebab(prop)}`;

  function forEachEntry(fn: (key: string, value: RGB) => void): void {
    Object.entries(_.state()).forEach(([k, v]) => {
      v && fn(k, v);
    });
  }

  function actualize(): void {
    forEachEntry((k, v) => {
      setCssVar(getCSSVarName!(k), v);
    });
  }

  actualize();
  _.state.sub(actualize);
  _.isCssVarsBound.set(true);

  return () => {
    forEachEntry(deleteCssVar);
    _.state.unsub(actualize);
    _.isCssVarsBound.set(false);
  };
}

/**
 * @since v6.10
 */
export const accentTextColor = createStateComputed('accentTextColor');

export const backgroundColor = createStateComputed('bgColor');

export const buttonColor = createStateComputed('buttonColor');

export const buttonTextColor = createStateComputed('buttonTextColor');

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
  const { bgColor } = _.state();
  return !bgColor || isColorDark(bgColor);
});

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = computed(_.isCssVarsBound);

export const linkColor = createStateComputed('linkColor');

/**
 * Mounts the component.
 *
 * This function restores the component state and is automatically saving it in the local storage
 * if it changed.
 */
export function mount(): void {
  if (!_.isMounted()) {
    on(THEME_CHANGED_EVENT, onThemeChanged);
    _.state.set(isPageReload() && getStorageValue(STORAGE_KEY) || retrieveLaunchParams().themeParams);
    _.isMounted.set(true);
  }
}

/**
 * Actualizes the theme parameters whenever an according event was received.
 * @param e - event data.
 */
const onThemeChanged: EventListener<'theme_changed'> = (e) => {
  const value = parse(e.theme_params);
  _.state.set(value);
  setStorageValue(STORAGE_KEY, value);
};

export const state = computed(_.state);

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

/**
 * Unmounts the component, removing the listener, saving the component state in the local storage.
 */
export function unmount(): void {
  if (_.isMounted()) {
    off(THEME_CHANGED_EVENT, onThemeChanged);
    _.isMounted.set(false);
  }
}
