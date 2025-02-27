import { describe, expect, it } from 'vitest';
import { is, parse } from 'valibot';

import { themeParams } from '@/generators/themeParams.js';

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
    expect(is(themeParams(), {
      accent_text_color: -10177041,
      bg_color: -14602949,
      bottom_bar_bg_color: -15393241,
      button_color: -11491093,
      button_text_color: -1,
      destructive_text_color: -1152913,
      header_bg_color: -14406343,
      hint_color: -8549479,
      link_color: -10572831,
      secondary_bg_color: -15393241,
      section_bg_color: -14866637,
      section_header_text_color: -8796932,
      section_separator_color: -15920616,
      subtitle_text_color: -8681584,
      text_color: -1,
    })).toBe(true);
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

  it('should properly handle numeric values', () => {
    expect(parse(themeParams(), {
      accent_text_color: -10177041,
      bg_color: -14602949,
      bottom_bar_bg_color: -15393241,
      button_color: -11491093,
      button_text_color: -1,
      destructive_text_color: -1152913,
      header_bg_color: -14406343,
      hint_color: -8549479,
      link_color: -10572831,
      secondary_bg_color: -15393241,
      section_bg_color: -14866637,
      section_header_text_color: -8796932,
      section_separator_color: -15920616,
      subtitle_text_color: -8681584,
      text_color: -1,
    })).toStrictEqual({
      accent_text_color: '#64b5ef',
      bg_color: '#212d3b',
      bottom_bar_bg_color: '#151e27',
      button_color: '#50a8eb',
      button_text_color: '#ffffff',
      destructive_text_color: '#ee686f',
      header_bg_color: '#242d39',
      hint_color: '#7d8b99',
      link_color: '#5eabe1',
      secondary_bg_color: '#151e27',
      section_bg_color: '#1d2733',
      section_header_text_color: '#79c4fc',
      section_separator_color: '#0d1218',
      subtitle_text_color: '#7b8790',
      text_color: '#ffffff',
    });
  });
});
