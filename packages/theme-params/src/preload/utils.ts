import {init} from 'twa-bridge';
import {ThemeParams} from '../types';
import {extractThemeFromJson, extractThemeFromLocation} from '../utils';

/**
 * Logs error connected with CSS variables in console.
 * @param e - error.
 */
export function logError(e: unknown) {
  console.error('An error occurred while setting theme params CSS variables.', e);
}

/**
 * Converts applied theme information to CSS variables.
 * @param theme - theme to apply.
 */
export function applyTheme(theme: ThemeParams) {
  // Iterate over every theme params color and create css variable.
  Object.entries(theme).forEach(([param, color]) => {
    if (typeof color !== 'string') {
      return;
    }
    document.documentElement.style.setProperty(
      // Preformat CSS variable name.
      '--theme-' + param.replace(/[A-Z]/g, letter => {
        return '-' + letter.toLowerCase();
      }),
      color,
    );
  });
}

/**
 * This script is intended to be inserted in `<head>` section of html document.
 * It will create a list of CSS-variables associated with application theming.
 *
 * Additionally, this scripts automatically updates CSS-variables in case,
 * theme was changed externally.
 *
 * According to current code, CSS variables with these names will be inserted:
 * --theme-background-color
 * --theme-button-color
 * --theme-button-text-color
 * --theme-hint-color
 * --theme-link-color
 * --theme-secondary-background-color
 * --theme-text-color
 */
export function run() {
  // TODO: Extend this script with load from session storage. Current script
  //  will not work in case, user reloaded application via "Reload Page" button.

  try {
    // On init, we are able to extract theme from current location.
    applyTheme(extractThemeFromLocation());
  } catch (e) {
    logError(e);
  }

  // Then, we should track for theme changes with help of bridge.
  const bridge = init();

  bridge.on('theme_changed', ({theme_params}) => {
    try {
      applyTheme(extractThemeFromJson(theme_params));
    } catch (e) {
      logError(e);
    }
  });

  // We should call this method due to bug in platform.
  // Issue: https://github.com/Telegram-Web-Apps/sdk/issues/14
  bridge.postEvent('web_app_request_theme');
}