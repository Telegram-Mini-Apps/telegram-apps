import { describe, expect, it } from 'vitest';

import { parseThemeParams } from './parseThemeParams.js';

describe('parse', () => {
  describe.each([
    { from: 'accent_text_color', to: 'accentTextColor' },
    { from: 'bg_color', to: 'bgColor' },
    { from: 'button_color', to: 'buttonColor' },
    { from: 'button_text_color', to: 'buttonTextColor' },
    { from: 'destructive_text_color', to: 'destructiveTextColor' },
    { from: 'header_bg_color', to: 'headerBgColor' },
    { from: 'hint_color', to: 'hintColor' },
    { from: 'link_color', to: 'linkColor' },
    { from: 'secondary_bg_color', to: 'secondaryBgColor' },
    { from: 'section_header_text_color', to: 'sectionHeaderTextColor' },
    { from: 'section_bg_color', to: 'sectionBgColor' },
    { from: 'subtitle_text_color', to: 'subtitleTextColor' },
    { from: 'text_color', to: 'textColor' },
  ])('$to', ({ from, to }) => {
    it(`should throw if "${from}" property contains not a string in format "#RRGGBB"`, () => {
      expect(() => parseThemeParams({ [from]: 999 })).toThrow();
    });

    it(`should map to "${to}" property parsing it as string in "#RRGGBB" format`, () => {
      expect(parseThemeParams({ [from]: '#aabbcc' })).toStrictEqual({ [to]: '#aabbcc' });
    });
  });
});

// TODO: request tests
