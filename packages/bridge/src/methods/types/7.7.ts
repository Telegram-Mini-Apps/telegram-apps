import type { CreateParams } from './utils.js';

export interface Methods77 {
  /**
   * Changes swipe behavior.
   * @see https://docs.telegram-mini-apps.com/platform/methods#web-app-setup-swipe-behavior
   * @since v7.7
   */
  web_app_setup_swipe_behavior: CreateParams<{
    allow_vertical_swipe: boolean;
  }>;
}