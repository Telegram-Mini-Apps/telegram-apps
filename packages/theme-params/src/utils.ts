import {createJsonStructParser, parseJsonParamAsOptRGB} from 'twa-core';

import {ThemeParams} from './types';

/**
 * Extracts theme information from value which could be presented as
 * JSON object.
 */
export const extractThemeFromJson = createJsonStructParser<ThemeParams>({
  backgroundColor: ['bg_color', parseJsonParamAsOptRGB],
  buttonColor: ['button_color', parseJsonParamAsOptRGB],
  buttonTextColor: ['button_text_color', parseJsonParamAsOptRGB],
  hintColor: ['hint_color', parseJsonParamAsOptRGB],
  linkColor: ['link_color', parseJsonParamAsOptRGB],
  secondaryBackgroundColor: ['secondary_bg_color', parseJsonParamAsOptRGB],
  textColor: ['text_color', parseJsonParamAsOptRGB],
});

/**
 * Extracts theme parameters information from current window location.
 */
export function extractThemeFromLocation(): ThemeParams {
  // We expect tgWebAppThemeParams to exist in search params.
  const searchParam = new URLSearchParams(window.location.hash.slice(1))
    .get('tgWebAppThemeParams');

  if (searchParam === null) {
    throw new Error('Parameter "tgWebAppThemeParams" is missing.');
  }
  return extractThemeFromJson(searchParam);
}