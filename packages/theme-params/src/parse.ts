import { json, rgb } from '@tma.js/parsing';
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

const rgbOptional = rgb().optional();

const parser = json<ThemeParams>({
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
  textColor: {
    type: rgbOptional,
    from: 'text_color',
  },
  secondaryBackgroundColor: {
    type: rgbOptional,
    from: 'secondary_bg_color',
  },
});

/**
 * Parses incoming value as theme parameters. Value passed should be a JSON object converted
 * to string, or JSON object itself.
 * @param value - value to parse.
 */
export function parse(value: unknown): ThemeParams {
  return parser.parse(value);
}
