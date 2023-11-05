import { json, rgb } from '@tma.js/parsing';

import type { ThemeParams } from './types.js';

const rgbOptional = rgb().optional();

function field(from: string) {
  return {
    type: rgbOptional,
    from,
  };
}

/**
 * Returns parser used to parse theme parameters.
 */
export function themeParams() {
  return json<ThemeParams>({
    accentTextColor: field('accent_text_color'),
    backgroundColor: field('bg_color'),
    buttonColor: field('button_color'),
    buttonTextColor: field('button_text_color'),
    destructiveTextColor: field('destructive_text_color'),
    headerBackgroundColor: field('header_bg_color'),
    hintColor: field('hint_color'),
    linkColor: field('link_color'),
    secondaryBackgroundColor: field('secondary_bg_color'),
    sectionHeaderTextColor: field('section_header_text_color'),
    sectionBackgroundColor: field('section_bg_color'),
    subtitleTextColor: field('subtitle_text_color'),
    textColor: field('text_color'),
  });
}
