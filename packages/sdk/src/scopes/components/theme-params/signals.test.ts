import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetPackageState } from '@test-utils/utils.js';

import {
  isDark,
  _state,
  backgroundColor,
  secondaryBackgroundColor,
  headerBackgroundColor,
  buttonColor,
  linkColor,
  sectionHeaderTextColor,
  subtitleTextColor,
  textColor,
  destructiveTextColor,
  sectionBackgroundColor,
  sectionSeparatorColor,
  hintColor,
  buttonTextColor,
  accentTextColor,
  bottomBarBgColor,
} from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
});

describe.each([
  ['accentTextColor', accentTextColor, 'accent_text_color'],
  ['backgroundColor', backgroundColor, 'bg_color'],
  ['buttonColor', buttonColor, 'button_color'],
  ['buttonTextColor', buttonTextColor, 'button_text_color'],
  ['bottomBarBgColor', bottomBarBgColor, 'bottom_bar_bg_color'],
  ['destructiveTextColor', destructiveTextColor, 'destructive_text_color'],
  ['headerBackgroundColor', headerBackgroundColor, 'header_bg_color'],
  ['hintColor', hintColor, 'hint_color'],
  ['linkColor', linkColor, 'link_color'],
  ['secondaryBackgroundColor', secondaryBackgroundColor, 'secondary_bg_color'],
  ['sectionBackgroundColor', sectionBackgroundColor, 'section_bg_color'],
  ['sectionHeaderTextColor', sectionHeaderTextColor, 'section_header_text_color'],
  ['sectionSeparatorColor', sectionSeparatorColor, 'section_separator_color'],
  ['subtitleTextColor', subtitleTextColor, 'subtitle_text_color'],
  ['textColor', textColor, 'text_color'],
] as const)('%s', (_, signal, source) => {
  it(`should take value from "${source}" state property`, () => {
    _state.set({ [source]: '#abcfff' });
    expect(signal()).toBe('#abcfff');
  });
});

describe('isDark', () => {
  it('should return true if bg_color is missing', () => {
    _state.set({});
    expect(isDark()).toBe(true);
  });

  it('should return true if bg_color is considered dark. False otherwise', () => {
    _state.set({ bg_color: '#000000' });
    expect(isDark()).toBe(true);

    _state.set({ bg_color: '#ffffff' });
    expect(isDark()).toBe(false);
  });
});