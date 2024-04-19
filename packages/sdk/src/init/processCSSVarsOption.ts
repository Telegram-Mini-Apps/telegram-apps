import type { MiniApp } from '@/components/mini-app/MiniApp.js';
import type { ThemeParams } from '@/components/theme-params/ThemeParams.js';
import type { Viewport } from '@/components/viewport/Viewport.js';
import { bindMiniAppCSSVars } from '@/css-vars/bindMiniAppCSSVars.js';
import { bindThemeCSSVars } from '@/css-vars/bindThemeCSSVars.js';
import { bindViewportCSSVars } from '@/css-vars/bindViewportCSSVars.js';

import type { InitCSSVarsOption, InitCSSVarsSpecificOption } from './types.js';

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
      viewportOrPromise.then(bindViewportCSSVars);
    } else {
      bindViewportCSSVars(viewportOrPromise);
    }
  }
}
