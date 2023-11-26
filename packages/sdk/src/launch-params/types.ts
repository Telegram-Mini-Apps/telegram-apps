import type { InitDataParsed } from '~/init-data/index.js';
import type { ThemeParamsParsed } from '~/theme-params/index.js';
import type { Platform } from '~/types/index.js';

/**
 * Telegram Mini Apps launch parameters.
 * @see https://docs.telegram-mini-apps.com/platform/launch-parameters/common-information
 */
export interface LaunchParams {
  /**
   * Current Mini Apps version.
   */
  version: string;

  /**
   * Current launch init data. Can be missing in case, application was launched via
   * KeyboardButton.
   */
  initData?: InitDataParsed;

  /**
   * The same as initData but in initial, raw format.
   */
  initDataRaw?: string;

  /**
   * Current Telegram application identifier.
   */
  platform: Platform;

  /**
   * Mini App palette settings.
   */
  themeParams: ThemeParamsParsed;

  /**
   * True if Mini App is currently launched in inline mode.
   */
  botInline?: boolean;

  /**
   * True if application is required to show the Settings Button.
   */
  showSettings?: boolean;
}

export interface LaunchData {
  /**
   * Was current application reloaded.
   */
  isPageReload: boolean;

  /**
   * Current application launch parameters.
   */
  launchParams: LaunchParams;
}
