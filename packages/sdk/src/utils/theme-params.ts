import {createJsonParser, RGB} from '@twa.js/utils';

/**
 * Describes theme parameters which are passed to WebApp.
 * @see https://core.telegram.org/api/bots/webapps#theme-parameters
 */
interface ThemeParams {
  /**
   * Background color.
   */
  backgroundColor: RGB;
  /**
   * Button color.
   */
  buttonColor: RGB;
  /**
   * Button text color.
   */
  buttonTextColor: RGB;
  /**
   * Hint color.
   */
  hintColor: RGB;
  /**
   * Link color.
   */
  linkColor: RGB;
  /**
   * Secondary background color.
   * @since Web App version 6.1+
   */
  secondaryBackgroundColor?: RGB;
  /**
   * Text color.
   */
  textColor: RGB;
}

/**
 * Parses value as theme params.
 */
const parseThemeParams = createJsonParser({
  backgroundColor: {type: 'rgb', from: 'bg_color'},
  buttonColor: {type: 'rgb', from: 'button_color'},
  buttonTextColor: {type: 'rgb', from: 'button_text_color'},
  hintColor: {type: 'rgb', from: 'hint_color'},
  linkColor: {type: 'rgb', from: 'link_color'},
  textColor: {type: 'rgb', from: 'text_color'},
  secondaryBackgroundColor: {
    type: 'rgb',
    from: 'secondary_bg_color',
    optional: true,
  },
});

export {parseThemeParams, ThemeParams};