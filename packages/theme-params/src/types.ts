import {RGBColor} from 'twa-core';

/**
 * Describes theme parameters which are passed to WebApp.
 * @see https://core.telegram.org/bots/webapps#themeparams
 */
export interface ThemeParams {
  backgroundColor?: RGBColor;
  buttonColor?: RGBColor;
  buttonTextColor?: RGBColor;
  hintColor?: RGBColor;
  linkColor?: RGBColor;
  secondaryBackgroundColor?: RGBColor;
  textColor?: RGBColor;
}
