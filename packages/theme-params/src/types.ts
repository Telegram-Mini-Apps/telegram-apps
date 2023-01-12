import {RGB} from 'twa-core';

/**
 * Describes theme parameters which are passed to WebApp.
 * @see https://core.telegram.org/api/bots/webapps#theme-parameters
 */
export interface ThemeParams {
  /**
   * Background color.
   */
  backgroundColor?: RGB;
  /**
   * Button color.
   */
  buttonColor?: RGB;
  /**
   * Button text color.
   */
  buttonTextColor?: RGB;
  /**
   * Hint color.
   */
  hintColor?: RGB;
  /**
   * Link color.
   */
  linkColor?: RGB;
  /**
   * Secondary background color.
   * @since Web App version 6.1+
   */
  secondaryBackgroundColor?: RGB;
  /**
   * Text color.
   */
  textColor?: RGB;
}
