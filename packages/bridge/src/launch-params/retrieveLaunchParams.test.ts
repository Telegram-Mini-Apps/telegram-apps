import { afterEach, describe, expect, it, vi } from 'vitest';

import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('window.location.href contains launch params', () => {
  it('should retrieve launch params from the window.location.href. Throw an error if data is invalid or missing', () => {
    vi
      .spyOn(window.location, 'href', 'get')
      .mockImplementationOnce(() => {
        return '/abc?tgWebAppStartParam=location_hash#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
      });

    expect(retrieveLaunchParams()).toStrictEqual({
      tgWebAppPlatform: 'tdesktop',
      tgWebAppVersion: '7.0',
      tgWebAppThemeParams: {},
      tgWebAppStartParam: 'location_hash',
    });
  });
});

describe('first navigation entry contains launch params', () => {
  it('should retrieve launch params from the window.performance. Throw an error if data is invalid or missing', () => {
    vi
      .spyOn(performance, 'getEntriesByType')
      .mockImplementationOnce(() => [{
        name: '/abc?tgWebAppStartParam=performance#tgWebAppPlatform=macos&tgWebAppVersion=7.3&tgWebAppThemeParams=%7B%7D',
      }] as any);

    expect(retrieveLaunchParams()).toStrictEqual({
      tgWebAppPlatform: 'macos',
      tgWebAppVersion: '7.3',
      tgWebAppThemeParams: {},
      tgWebAppStartParam: 'performance',
    });
  });
});

describe('session storage contains launch params', () => {
  it('should return launch parameters from the session storage tapps/launchParams key. If data is missing or invalid, throw an error', () => {
    const spy = vi
      .spyOn(sessionStorage, 'getItem')
      .mockImplementationOnce(() => '');
    expect(() => retrieveLaunchParams()).toThrow();

    spy.mockClear();
    spy.mockImplementationOnce(() => {
      return '"tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppVersion=7.5"';
    });
    expect(retrieveLaunchParams()).toStrictEqual({
      tgWebAppVersion: '7.5',
      tgWebAppPlatform: 'android',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
      },
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('tapps/launchParams');
  });
});