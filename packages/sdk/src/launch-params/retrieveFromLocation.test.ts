import { it, vi, expect, afterEach } from 'vitest';

import { retrieveFromLocation } from './retrieveFromLocation.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should retrieve launch params from the window.location.href. Throw an error if data is invalid or missing', () => {
  const spy = vi
    .spyOn(window.location, 'href', 'get')
    .mockImplementationOnce(() => {
      return '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
    });

  expect(retrieveFromLocation()).toStrictEqual({
    platform: 'tdesktop',
    version: '7.0',
    themeParams: {},
    startParam: 'START',
  });

  spy.mockImplementationOnce(() => '');
  expect(() => retrieveFromLocation()).toThrow();
});