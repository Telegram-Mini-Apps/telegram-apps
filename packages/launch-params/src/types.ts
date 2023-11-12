import type { InitData } from '@tma.js/init-data';
import type { ThemeParams } from '@tma.js/theme-params';

/**
 * Telegram application platform name.
 */
export type Platform =
  | 'android'
  | 'android_x'
  | 'ios'
  | 'macos'
  | 'tdesktop'
  | 'web'
  | 'weba'
  | 'unigram'
  | 'unknown'
  | string;

/**
 * Telegram Mini Apps launch parameters.
 * @see https://docs.telegram-mini-apps.com/launch-parameters/common-information
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
  initData?: InitData;

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
  themeParams: ThemeParams;

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
