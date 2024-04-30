import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';

import { bindThemeParamsCSSVars } from './bindThemeParamsCSSVars.js';

let setCSSPropertySpy: FnToSpy<typeof document.documentElement.style.setProperty>;

beforeAll(() => {
  setCSSPropertySpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
});

afterEach(() => {
  vi.clearAllMocks();
});

it('should set --tg-theme-{key} CSS vars, where key is a kebab-cased theme keys', () => {
  bindThemeParamsCSSVars(new ThemeParams({
    bgColor: '#abcdef',
    accentTextColor: '#000011',
  }));

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-bg-color', '#abcdef');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#000011');
});

it('should update --tg-theme-{key} variables to the values, received in the Theme change events', async () => {
  const tp = new ThemeParams({
    bgColor: '#abcdef',
    accentTextColor: '#000011',
  });
  bindThemeParamsCSSVars(tp);
  setCSSPropertySpy.mockClear();

  tp.listen();

  dispatchWindowMessageEvent('theme_changed', {
    theme_params: {
      bg_color: '#111111',
      accent_text_color: '#222222',
      text_color: '#333333',
    },
  });

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-bg-color', '#111111');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#222222');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-text-color', '#333333');
});
