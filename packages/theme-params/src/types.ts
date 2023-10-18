import type { RGB } from '@tma.js/colors';

/**
 * Application theme parameters. Defines palette used by the Telegram application.
 */
export interface ThemeParams {
  backgroundColor?: RGB;
  buttonColor?: RGB;
  buttonTextColor?: RGB;
  hintColor?: RGB;
  linkColor?: RGB;
  secondaryBackgroundColor?: RGB;
  textColor?: RGB;
}
