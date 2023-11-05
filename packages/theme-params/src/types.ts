import type { RGB } from '@tma.js/colors';

/**
 * Application [theme parameters](https://docs.telegram-mini-apps.com/functionality/theming).
 * Defines palette used by the Telegram application.
 */
export interface ThemeParams {
  /**
   * @since v6.10
   */
  accentTextColor?: RGB;
  backgroundColor?: RGB;
  buttonColor?: RGB;
  buttonTextColor?: RGB;
  /**
   * @since v6.10
   */
  destructiveTextColor?: RGB;
  /**
   * @since v6.10
   */
  headerBackgroundColor?: RGB;
  hintColor?: RGB;
  linkColor?: RGB;
  secondaryBackgroundColor?: RGB;
  /**
   * @since v6.10
   */
  sectionBackgroundColor?: RGB;
  /**
   * @since v6.10
   */
  sectionHeaderTextColor?: RGB;
  /**
   * @since v6.10
   */
  subtitleTextColor?: RGB;
  textColor?: RGB;
}
