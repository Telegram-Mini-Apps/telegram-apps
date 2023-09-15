import { json, rgb } from '@twa.js/parsing';

import type { RGB } from '@twa.js/colors';

/**
 * Application theme parameters. Defines palette used by the Telegram application.
 */
export interface ThemeParamsType {
  backgroundColor?: RGB;
  buttonColor?: RGB;
  buttonTextColor?: RGB;
  hintColor?: RGB;
  linkColor?: RGB;
  secondaryBackgroundColor?: RGB;
  textColor?: RGB;
}

const themeParamsParser = json<ThemeParamsType>({
  backgroundColor: { type: rgb().optional(), from: 'bg_color' },
  buttonColor: { type: rgb().optional(), from: 'button_color' },
  buttonTextColor: { type: rgb().optional(), from: 'button_text_color' },
  hintColor: { type: rgb().optional(), from: 'hint_color' },
  linkColor: { type: rgb().optional(), from: 'link_color' },
  textColor: { type: rgb().optional(), from: 'text_color' },
  secondaryBackgroundColor: { type: rgb().optional(), from: 'secondary_bg_color' },
});

/**
 * Parses incoming value as theme parameters.
 * @param value - value to parse.
 */
export function parseThemeParams(value: unknown): ThemeParamsType {
  return themeParamsParser.parse(value);
}
