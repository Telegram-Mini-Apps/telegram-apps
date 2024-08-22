import { it, vi, expect, afterEach } from 'vitest';

import { retrieveFromPerformance } from './retrieveFromPerformance.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should retrieve launch params from the window.performance. Throw an error if data is invalid or missing', () => {
  const spy = vi
    .spyOn(performance, 'getEntriesByType')
    .mockImplementationOnce(() => [{
      name: '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D',
    }] as any);

  expect(retrieveFromPerformance()).toStrictEqual({
    platform: 'tdesktop',
    version: '7.0',
    themeParams: {},
    startParam: 'START',
  });

  spy.mockImplementationOnce(() => []);
  expect(() => retrieveFromPerformance()).toThrow();
});