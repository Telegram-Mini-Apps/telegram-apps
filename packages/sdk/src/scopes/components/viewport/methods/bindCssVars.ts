import { camelToKebab, deleteCssVar, setCssVar } from '@telegram-apps/bridge';

import { throwCssVarsBound } from '@/scopes/toolkit/throwCssVarsBound.js';

import { isCssVarsBound } from '../signals/css-vars.js';
import { height, width, stableHeight } from '../signals/dimensions.js';
import {
  safeAreaInsetBottom,
  safeAreaInsetTop,
  safeAreaInsetRight,
  safeAreaInsetLeft,
} from '../signals/safe-area-insets.js';
import {
  contentSafeAreaInsetBottom,
  contentSafeAreaInsetTop,
  contentSafeAreaInsetRight,
  contentSafeAreaInsetLeft,
} from '../signals/content-safe-area-insets.js';

import { wrapMounted } from './wrappers.js';
import type { GetCSSVarNameFn } from '../types.js';

/**
 * Creates CSS variables connected with the current viewport.
 *
 * By default, created CSS variables names are following the pattern
 * "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab
 * case.
 *
 * Default variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-width`
 * - `--tg-viewport-stable-height`
 * - `--tg-viewport-content-safe-area-inset-top`
 * - `--tg-viewport-content-safe-area-inset-bottom`
 * - `--tg-viewport-content-safe-area-inset-left`
 * - `--tg-viewport-content-safe-area-inset-right`
 * - `--tg-viewport-safe-area-inset-top`
 * - `--tg-viewport-safe-area-inset-bottom`
 * - `--tg-viewport-safe-area-inset-left`
 * - `--tg-viewport-safe-area-inset-right`
 *
 * Variables are being automatically updated if the viewport was changed.
 *
 * @param getCSSVarName - function, returning computed complete CSS variable name. The CSS
 * variable will only be defined if the function returned non-empty string value.
 * @returns Function to stop updating variables.
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_VARS_ALREADY_BOUND
 * @throws {TypedError} ERR_NOT_MOUNTED
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @example Using no arguments
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars();
 * }
 * @example Using custom CSS vars generator
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars(key => `--my-prefix-${key}`);
 * }
 */
export const bindCssVars = wrapMounted(
  'bindCssVars',
  (getCSSVarName?: GetCSSVarNameFn): VoidFunction => {
    isCssVarsBound() && throwCssVarsBound();

    getCSSVarName ||= (prop) => `--tg-viewport-${camelToKebab(prop)}`;

    const settings = ([
      ['height', height],
      ['stableHeight', stableHeight],
      ['width', width],
      ['safeAreaInsetTop', safeAreaInsetTop],
      ['safeAreaInsetBottom', safeAreaInsetBottom],
      ['safeAreaInsetLeft', safeAreaInsetLeft],
      ['safeAreaInsetRight', safeAreaInsetRight],
      ['contentSafeAreaInsetTop', contentSafeAreaInsetTop],
      ['contentSafeAreaInsetBottom', contentSafeAreaInsetBottom],
      ['contentSafeAreaInsetLeft', contentSafeAreaInsetLeft],
      ['contentSafeAreaInsetRight', contentSafeAreaInsetRight],
    ] as const).reduce<[
      update: VoidFunction,
      removeListener: VoidFunction,
      cssVar: string
    ][]>((acc, [key, signal]) => {
      const cssVar = getCSSVarName(key);
      if (cssVar) {
        const update = () => {
          setCssVar(cssVar, `${signal()}px`);
        };
        acc.push([update, signal.sub(update), cssVar]);
      }
      return acc;
    }, []);

    // Instantly set CSS variables.
    settings.forEach(setting => {
      setting[0]();
    });
    isCssVarsBound.set(true);

    return () => {
      settings.forEach(s => {
        // Remove update listener.
        s[1]();
        // Remove CSS variable.
        deleteCssVar(s[2]);
      });
      isCssVarsBound.set(false);
    };
  },
);