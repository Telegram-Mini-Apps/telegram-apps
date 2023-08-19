import type { RGB } from '@twa.js/utils';

import type { ThemeParams, WebApp } from '../components/index.js';

/**
 * Sets new CSS variable in case, its value is not null.
 * @param name - variable name.
 * @param color - variable value.
 */
function setCssVariable(name: string, color: RGB | null): void {
  if (color === null) {
    return;
  }
  document.documentElement.style.setProperty(name, color);
}

function applyTheme(themeParams: ThemeParams): void {
  const {
    backgroundColor,
    buttonTextColor,
    secondaryBackgroundColor,
    hintColor,
    buttonColor,
    linkColor,
    textColor,
  } = themeParams;

  setCssVariable('--tg-theme-bg-color', backgroundColor);
  setCssVariable('--tg-theme-button-color', buttonColor);
  setCssVariable('--tg-theme-button-text-color', buttonTextColor);
  setCssVariable('--tg-theme-hint-color', hintColor);
  setCssVariable('--tg-theme-link-color', linkColor);
  setCssVariable('--tg-theme-secondary-bg-color', secondaryBackgroundColor);
  setCssVariable('--tg-theme-text-color', textColor);
}

function applyWebApp(webApp: WebApp, themeParams: ThemeParams) {
  const { backgroundColor, secondaryBackgroundColor } = themeParams;
  const { backgroundColor: webAppBackgroundColor, headerColor } = webApp;

  setCssVariable('--tg-bg-color', webAppBackgroundColor);
  setCssVariable('--tg-header-color', headerColor === 'bg_color' ? backgroundColor : secondaryBackgroundColor);
}

/**
 * Accepts Web App and Theme Params instance extracting properties connected
 * with colors and creates global CSS variables.
 *
 * WebApp variables:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 *
 * ThemeParams variables:
 * - `--tg-theme-bg-color`
 * - `--tg-theme-button-color`
 * - `--tg-theme-button-text-color`
 * - `--tg-theme-hint-color`
 * - `--tg-theme-link-color`
 * - `--tg-theme-secondary-bg-color`
 * - `--tg-theme-text-color`
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed Web App and Theme Params instances.
 *
 * @param webApp
 * @param themeParams
 */
export function bindCSSVariables(webApp: WebApp, themeParams: ThemeParams): void {
  const actualizeAll = () => {
    applyTheme(themeParams);
    applyWebApp(webApp, themeParams);
  };

  themeParams.on('changed', actualizeAll);
  webApp.on('backgroundColorChanged', () => applyWebApp(webApp, themeParams));
  webApp.on('headerColorChanged', () => applyWebApp(webApp, themeParams));

  actualizeAll();
}
