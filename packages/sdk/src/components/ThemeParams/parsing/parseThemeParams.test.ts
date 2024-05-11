import { describe, expect, it } from 'vitest';

import { parseThemeParams } from './parseThemeParams.js';

[
  ['accent_text_color', 'accentTextColor'],
  ['bg_color', 'bgColor'],
  ['button_color', 'buttonColor'],
  ['button_text_color', 'buttonTextColor'],
  ['destructive_text_color', 'destructiveTextColor'],
  ['header_bg_color', 'headerBgColor'],
  ['hint_color', 'hintColor'],
  ['link_color', 'linkColor'],
  ['secondary_bg_color', 'secondaryBgColor'],
  ['section_header_text_color', 'sectionHeaderTextColor'],
  ['section_bg_color', 'sectionBgColor'],
  ['subtitle_text_color', 'subtitleTextColor'],
  ['text_color', 'textColor'],
].forEach(([from, to]) => {
  describe(to, () => {
    it(`should throw if "${from}" property contains not a string in format "#RRGGBB"`, () => {
      expect(() => parseThemeParams({ [from]: 999 })).toThrow();
    });

    it(`should map to "${to}" property parsing it as string in "#RRGGBB" format`, () => {
      expect(parseThemeParams({ [from]: '#aabbcc' })).toStrictEqual({ [to]: '#aabbcc' });
    });
  });
});
