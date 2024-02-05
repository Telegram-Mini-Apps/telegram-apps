import { expect, it } from 'vitest';
import { retrieveFromUrl } from '../retrieveFromUrl';

it('should return launch parameters based on hash only in case, URL does not contain the query part', () => {
  expect(retrieveFromUrl('#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D')).toEqual({
    platform: 'tdesktop',
    version: '7.0',
    themeParams: {},
  });
});

it('should return launch parameters based on query params and hash in case, URL contains both parts', () => {
  expect(retrieveFromUrl('?tgWebAppStartParam=900#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D')).toEqual({
    platform: 'tdesktop',
    version: '7.0',
    themeParams: {},
    startParam: '900',
  });
});
