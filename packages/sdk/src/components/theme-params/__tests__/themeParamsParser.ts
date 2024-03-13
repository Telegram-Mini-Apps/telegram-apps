import { describe, expect, it } from 'vitest';

import { themeParamsParser } from '../themeParamsParser';

[
  ['accent_text_color', 'accentTextColor'],
  ['bg_color', 'backgroundColor'],
  ['button_color', 'buttonColor'],
  ['button_text_color', 'buttonTextColor'],
  ['destructive_text_color', 'destructiveTextColor'],
  ['header_bg_color', 'headerBackgroundColor'],
  ['hint_color', 'hintColor'],
  ['link_color', 'linkColor'],
  ['secondary_bg_color', 'secondaryBackgroundColor'],
  ['section_header_text_color', 'sectionHeaderTextColor'],
  ['section_bg_color', 'sectionBackgroundColor'],
  ['subtitle_text_color', 'subtitleTextColor'],
  ['text_color', 'textColor'],
].forEach(([from, to]) => {
  describe(to, () => {
    it(`should throw if "${from}" property contains not a string in format "#RRGGBB"`, () => {
      expect(() => themeParamsParser().parse({ [from]: 999 })).toThrow();
    });

    it(`should map to "${to}" property parsing it as string in "#RRGGBB" format`, () => {
      expect(themeParamsParser().parse({ [from]: '#aabbcc' })).toStrictEqual({ [to]: '#aabbcc' });
    });
  });
});
