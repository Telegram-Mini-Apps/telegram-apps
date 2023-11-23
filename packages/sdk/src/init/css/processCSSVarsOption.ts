import type { MiniApp } from '~/mini-app/index.js';
import type { ThemeParams } from '~/theme-params/index.js';
import type { Viewport } from '~/viewport/index.js';

import { bindMiniAppCSSVars } from './bindMiniAppCSSVars.js';
import { bindThemeCSSVars } from './bindThemeCSSVars.js';
import { bindViewportCSSVars } from './bindViewportCSSVars.js';
import type { InitCSSVarsOption, InitCSSVarsSpecificOption } from '../types.js';

/**
 * Converts init cssVars option to more narrow type.
 * @param option - option value.
 */
function parseCSSVarsOptions(option: InitCSSVarsOption): InitCSSVarsSpecificOption {
  if (typeof option === 'object') {
    return option;
  }
  return option
    ? {
      themeParams: true,
      viewport: true,
      miniApp: true,
    }
    : {};
}

/**
 * Process initialization CSS vars option.
 * @param option - option value.
 * @param miniApp - MiniApp instance.
 * @param themeParams - ThemeParams instance.
 * @param viewportOrPromise - Viewport instance or promise resolving it.
 */
export function processCSSVars(
  option: InitCSSVarsOption,
  miniApp: MiniApp,
  themeParams: ThemeParams,
  viewportOrPromise: Viewport | Promise<Viewport>,
): void {
  const cssVarsOptions = parseCSSVarsOptions(option);

  if (cssVarsOptions.miniApp) {
    bindMiniAppCSSVars(miniApp, themeParams);
  }

  if (cssVarsOptions.themeParams) {
    bindThemeCSSVars(themeParams);
  }

  if (cssVarsOptions.viewport) {
    if (viewportOrPromise instanceof Promise) {
      Promise.resolve(viewportOrPromise).then(bindViewportCSSVars);
    } else {
      bindViewportCSSVars(viewportOrPromise);
    }
  }
}
