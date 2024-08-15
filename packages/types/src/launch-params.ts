import type { InitData } from './init-data.js';
import type { Platform } from './common.js';
import type { ThemeParams } from './theme-params.js';

/**
 * Telegram Mini Apps launch parameters.
 * @see https://docs.telegram-mini-apps.com/platform/launch-parameters
 */
export interface LaunchParams {
  /**
   * True if Mini App is currently launched in inline mode.
   */
  botInline?: boolean;
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
   * True if application is required to show the Settings Button.
   */
  showSettings?: boolean;
  /**
   * Start parameter passed in the application link.
   */
  startParam?: string;
  /**
   * Mini App palette settings.
   */
  themeParams: ThemeParams;
  /**
   * Current Mini Apps version.
   */
  version: string;
}
