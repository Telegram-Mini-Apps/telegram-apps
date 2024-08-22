import { describe, expect, it } from 'vitest';

import { serializeThemeParams, themeParams } from './theme-params.js';

describe('themeParams', () => {
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
      expect(() => themeParams()({ [from]: 999 })).toThrow();
    });

    it(`should map to "${to}" property parsing it as string in "#RRGGBB" format`, () => {
      expect(themeParams()({ [from]: '#aabbcc' })).toStrictEqual({ [to]: '#aabbcc' });
    });
  });
});

describe('serializeThemeParams', () => {
  describe.each([
    { to: 'accent_text_color', from: 'accentTextColor' },
    { to: 'bg_color', from: 'bgColor' },
    { to: 'button_color', from: 'buttonColor' },
    { to: 'button_text_color', from: 'buttonTextColor' },
    { to: 'destructive_text_color', from: 'destructiveTextColor' },
    { to: 'header_bg_color', from: 'headerBgColor' },
    { to: 'hint_color', from: 'hintColor' },
    { to: 'link_color', from: 'linkColor' },
    { to: 'secondary_bg_color', from: 'secondaryBgColor' },
    { to: 'section_header_text_color', from: 'sectionHeaderTextColor' },
    { to: 'section_bg_color', from: 'sectionBgColor' },
    { to: 'subtitle_text_color', from: 'subtitleTextColor' },
    { to: 'text_color', from: 'textColor' },
  ])('$from', ({ from, to }) => {
    it(`should omit the "${to}" property in case this property is missing`, () => {
      expect(serializeThemeParams({})).not.toMatch(`"${to}"`);
    });

    it(`should map this property to "${to}" property`, () => {
      expect(serializeThemeParams({ [from]: '#aabbcc' })).toBe(`{"${to}":"#aabbcc"}`);
    });
  });
});
