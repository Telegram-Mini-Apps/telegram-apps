import { camelToKebab } from '@telegram-apps/toolkit';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';

import { CSSVarsBoundError } from '@/errors.js';
import { createSignalsTuple } from '@/signals-registry.js';
import { createWrapMounted } from '@/scopes/wrappers/createWrapMounted.js';
import { COMPONENT_NAME } from '@/scopes/components/viewport/const.js';
import { isMounted } from '@/scopes/components/viewport/mounting.js';

import {
  safeAreaInsetBottom,
  safeAreaInsetTop,
  safeAreaInsetRight,
  safeAreaInsetLeft,
  height,
  width,
  stableHeight,
  contentSafeAreaInsetBottom,
  contentSafeAreaInsetTop,
  contentSafeAreaInsetRight,
  contentSafeAreaInsetLeft,
} from './signals.js';
import type { GetCSSVarNameFn } from './types.js';

const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);

/**
 * True if CSS variables are currently bound.
 */
export const [_isCssVarsBound, isCssVarsBound] = createSignalsTuple(false);

/**
 * Creates CSS variables connected with the current viewport.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a viewport property name converted from camel case to kebab case.
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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {CSSVarsBoundError} CSS variables are already bound
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @throws {FunctionNotAvailableError} The SDK is not initialized
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
    if (isCssVarsBound()) {
      throw new CSSVarsBoundError();
    }

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
    _isCssVarsBound.set(true);

    return () => {
      settings.forEach(s => {
        // Remove update listener.
        s[1]();
        // Remove CSS variable.
        deleteCssVar(s[2]);
      });
      _isCssVarsBound.set(false);
    };
  },
);
