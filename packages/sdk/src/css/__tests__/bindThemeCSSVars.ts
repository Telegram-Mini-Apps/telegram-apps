import { expect, vi, it, SpyInstance, afterEach, beforeAll } from 'vitest';
import { bindThemeCSSVars } from '../bindThemeCSSVars';
import { ThemeParams } from '../../theme-params';
import { dispatchWindowMessageEvent } from '../../../test-utils/dispatchWindowMessageEvent';

let setCSSPropertySpy: SpyInstance<[string, string, string?], void>;

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
  bindThemeCSSVars(new ThemeParams({
    backgroundColor: '#abcdef',
    accentTextColor: '#000011',
  }));

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-background-color', '#abcdef');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#000011');
});

it('should update --tg-theme-{key}variables to the values, received in the Theme change events', async () => {
  const tp = new ThemeParams({
    backgroundColor: '#abcdef',
    accentTextColor: '#000011',
  });
  bindThemeCSSVars(tp);
  setCSSPropertySpy.mockClear();

  await tp.listen();

  dispatchWindowMessageEvent('theme_changed', {
    theme_params: {
      bg_color: '#111111',
      accent_text_color: '#222222',
      text_color: '#333333',
    },
  });

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(3);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-background-color', '#111111');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#222222');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-theme-text-color', '#333333');
});