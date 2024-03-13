import type { RGB } from '../../../colors/types.js';
import { json } from '../../../parsing/parsers/json.js';
import { rgb } from '../../../parsing/parsers/rgb.js';
import { toRecord } from '../../../parsing/toRecord.js';

export interface ThemeChangedPayload {
  /**
   * Map where the key is a theme stylesheet key and value is  the corresponding color in
   * `#RRGGBB` format.
   */
  theme_params: {
    /**
     * @since v6.10
     */
    accent_text_color?: RGB;
    bg_color?: RGB;
    button_color?: RGB;
    button_text_color?: RGB;
    /**
     * @since v6.10
     */
    destructive_text_color?: RGB;
    /**
     * @since v6.10
     */
    header_bg_color?: RGB;
    hint_color?: RGB;
    link_color?: RGB;
    secondary_bg_color?: RGB;
    /**
     * @since v6.10
     */
    section_bg_color?: RGB;
    /**
     * @since v6.10
     */
    section_header_text_color?: RGB;
    /**
     * @since v6.10
     */
    subtitle_text_color?: RGB;
    text_color?: RGB;
    [key: string]: RGB | undefined; // Future unknown palette keys.
  };
}

export function themeChanged() {
  return json<ThemeChangedPayload>({
    theme_params: (value) => {
      const parser = rgb().optional();

      return Object
        .entries(toRecord(value))
        .reduce<Partial<Record<string, RGB>>>((acc, [k, v]) => {
        acc[k] = parser.parse(v);
        return acc;
      }, {});
    },
  });
}
