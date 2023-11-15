import type { RGB } from '@tma.js/colors';

import type { ThemeParams, WebApp, Viewport } from '../components/index.js';
import type { InitCSSVarsOption, InitCSSVarsSpecificOption } from './types.js';

/**
 * Sets CSS variable.
 * @param name - variable name.
 * @param value - variable value.
 */
function setVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}

/**
 * Sets new CSS color variable in case, its value is not null.
 * @param name - variable name.
 * @param color - variable value.
 */
function setColorVariable(name: string, color: RGB | null): void {
  if (color === null) {
    return;
  }
  setVariable(name, color);
}

/**
 * Sets new CSS variable which value is amount of pixels.
 * @param name - variable name.
 * @param size - variable value.
 */
function setSizeVariable(name: string, size: number) {
  setVariable(name, `${size}px`);
}

/**
 * Creates CSS variables based on Mini App background and header colors with
 * theme parameters.
 * @param webApp - WebApp instance.
 * @param themeParams - theme parameters.
 */
function createWebAppVariables(webApp: WebApp, themeParams: ThemeParams): void {
  const { backgroundColor, secondaryBackgroundColor } = themeParams;
  const { backgroundColor: webAppBackgroundColor, headerColor } = webApp;

  setColorVariable('--tg-bg-color', webAppBackgroundColor);
  setColorVariable('--tg-header-color', headerColor === 'bg_color' ? backgroundColor : secondaryBackgroundColor);
}

/**
 * Creates CSS variables connected with theme parameters. Created CSS variables names are
 * following the pattern "--tg-theme-{name}". {name} is a theme parameters key name converted
 * from snake to kebab case.
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed ThemeParams instance.
 *
 * @param themeParams - ThemeParams instance.
 */
export function bindThemeCSSVariables(themeParams: ThemeParams): void {
  const actualize = () => {
    const state = themeParams.getState();

    Object.entries(state).forEach(([k, v]) => {
      const key = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      setColorVariable(`--tg-theme-${key}`, v || null);
    });
  };

  themeParams.on('changed', actualize);

  actualize();
}

/**
 * Creates CSS variables connected with WebApp background and header colors based on
 * passed WebApp and ThemeParams instances.
 *
 * Created variables:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 *
 * Variables are being automatically updated in case, corresponding properties are updating.
 *
 * @param webApp - WebApp instance.
 * @param themeParams - ThemeParams instance.
 */
export function bindWebAppVariables(webApp: WebApp, themeParams: ThemeParams): void {
  const actualize = () => createWebAppVariables(webApp, themeParams);

  themeParams.on('changed', actualize);
  webApp.on('backgroundColorChanged', actualize);
  webApp.on('headerColorChanged', actualize);

  actualize();
}

/**
 * Accepts Viewport instance and sets CSS variables connected with viewport
 * sizes.
 *
 * Be careful using this function as long as it can impact application
 * performance. Viewport size is changing rather often, this makes CSS
 * variables update, which leads to possible layout redraw.
 *
 * Variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-stable-height`
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed Viewport instance.
 *
 * @param viewport - Viewport instance.
 */
export function bindViewportCSSVariables(viewport: Viewport): void {
  const setHeight = () => {
    setSizeVariable('--tg-viewport-height', viewport.height);
  };

  const setStableHeight = () => {
    setSizeVariable('--tg-viewport-stable-height', viewport.stableHeight);
  };

  viewport.on('heightChanged', setHeight);
  viewport.on('stableHeightChanged', setStableHeight);

  setHeight();
  setStableHeight();
}

/**
 * Converts init cssVars option to more narrow type.
 * @param option - option value.
 */
export function parseCSSVarsOptions(option: InitCSSVarsOption): InitCSSVarsSpecificOption {
  if (typeof option === 'boolean') {
    return option
      ? { themeParams: true, viewport: true, webApp: true }
      : {};
  }
  return option;
}
