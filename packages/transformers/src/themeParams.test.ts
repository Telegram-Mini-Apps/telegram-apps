import { describe, expect, it } from 'vitest';
import { is, parse } from 'valibot';

import { themeParams } from '@/themeParams.js';

describe('themeParams', () => {
  it('should properly validate the value', () => {
    expect(is(themeParams(), {})).toBe(true);
    expect(is(themeParams(), {
      accent_text_color: '#6ab3f2',
      bg_color: '#17212b',
      bottom_bar_bg_color: '#17212b',
      button_color: '#5289c1',
      button_text_color: '#ffffff',
      destructive_text_color: '#ec3942',
      header_bg_color: '#17212b',
      hint_color: '#708599',
      link_color: '#6ab3f3',
      secondary_bg_color: '#232e3c',
      section_bg_color: '#17212b',
      section_header_text_color: '#6ab3f3',
      section_separator_color: '#111921',
      subtitle_text_color: '#708599',
      text_color: '#f5f5f5',
    })).toBe(true);
    expect(is(themeParams(), { accent_text_color: '#aabbc' })).toBe(false);
    expect(is(themeParams(), 'aaa')).toBe(false);
  });

  it('should camelize keys if true passed', () => {
    const input = {
      accent_text_color: '#6ab3f2',
      bg_color: '#17212b',
      bottom_bar_bg_color: '#17212b',
      button_color: '#5289c1',
      button_text_color: '#ffffff',
      destructive_text_color: '#ec3942',
      header_bg_color: '#17212b',
      hint_color: '#708599',
      link_color: '#6ab3f3',
      secondary_bg_color: '#232e3c',
      section_bg_color: '#17212b',
      section_header_text_color: '#6ab3f3',
      section_separator_color: '#111921',
      subtitle_text_color: '#708599',
      text_color: '#f5f5f5',
    };
    const inputCamelized = {
      accentTextColor: '#6ab3f2',
      bgColor: '#17212b',
      bottomBarBgColor: '#17212b',
      buttonColor: '#5289c1',
      buttonTextColor: '#ffffff',
      destructiveTextColor: '#ec3942',
      headerBgColor: '#17212b',
      hintColor: '#708599',
      linkColor: '#6ab3f3',
      secondaryBgColor: '#232e3c',
      sectionBgColor: '#17212b',
      sectionHeaderTextColor: '#6ab3f3',
      sectionSeparatorColor: '#111921',
      subtitleTextColor: '#708599',
      textColor: '#f5f5f5',
    };

    expect(parse(themeParams(), input)).not.toStrictEqual(inputCamelized);
    expect(parse(themeParams(false), input)).not.toStrictEqual(inputCamelized);
    expect(parse(themeParams(true), input)).toStrictEqual(inputCamelized);
  });
});
