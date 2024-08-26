import type { CreateParams } from './utils.js';

export interface Methods610 {
  /**
   * Updates the current state of the Settings Button.
   * @since v6.10
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-settings-button
   */
  web_app_setup_settings_button: CreateParams<{
    /**
     * Should the Settings Button be displayed.
     */
    is_visible: boolean;
  }>;
}