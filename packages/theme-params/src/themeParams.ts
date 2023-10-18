import { json, rgb } from '@tma.js/parsing';

import type { ThemeParams } from './types.js';

const rgbOptional = rgb().optional();

/**
 * Returns parser used to parse theme parameters.
 */
export function themeParams() {
  return json<ThemeParams>({
    backgroundColor: {
      type: rgbOptional,
      from: 'bg_color',
    },
    buttonColor: {
      type: rgbOptional,
      from: 'button_color',
    },
    buttonTextColor: {
      type: rgbOptional,
      from: 'button_text_color',
    },
    hintColor: {
      type: rgbOptional,
      from: 'hint_color',
    },
    linkColor: {
      type: rgbOptional,
      from: 'link_color',
    },
    secondaryBackgroundColor: {
      type: rgbOptional,
      from: 'secondary_bg_color',
    },
    textColor: {
      type: rgbOptional,
      from: 'text_color',
    },
  });
}
