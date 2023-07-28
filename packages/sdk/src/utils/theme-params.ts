import { json, type RGB } from '@twa.js/utils';

/**
 * Describes theme parameters which are passed to WebApp.
 * @see https://core.telegram.org/api/bots/webapps#theme-parameters
 */
export interface ThemeParams {
  backgroundColor?: RGB;
  buttonColor?: RGB;
  buttonTextColor?: RGB;
  hintColor?: RGB;
  linkColor?: RGB;
  /**
   * @since Web App version 6.1+
   */
  secondaryBackgroundColor?: RGB;
  textColor?: RGB;
}

/**
 * Parses value as theme params.
 */
export const themeParams = json({
  backgroundColor: { type: 'rgb', from: 'bg_color', optional: true },
  buttonColor: { type: 'rgb', from: 'button_color', optional: true },
  buttonTextColor: { type: 'rgb', from: 'button_text_color', optional: true },
  hintColor: { type: 'rgb', from: 'hint_color', optional: true },
  linkColor: { type: 'rgb', from: 'link_color', optional: true },
  textColor: { type: 'rgb', from: 'text_color', optional: true },
  secondaryBackgroundColor: {
    type: 'rgb',
    from: 'secondary_bg_color',
    optional: true,
  },
});
