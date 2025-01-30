import { afterEach, describe, expect, it, vi } from 'vitest';

import { retrieveRawLaunchParams } from '@/launch-params/retrieveRawLaunchParams.js';

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

    expect(retrieveRawLaunchParams()).toBe('tgWebAppStartParam=location_hash&tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D');
  });
});

describe('first navigation entry contains launch params', () => {
  it('should retrieve launch params from the window.performance. Throw an error if data is invalid or missing', () => {
    vi
      .spyOn(performance, 'getEntriesByType')
      .mockImplementationOnce(() => [{
        name: '/abc?tgWebAppStartParam=performance#tgWebAppPlatform=macos&tgWebAppVersion=7.3&tgWebAppThemeParams=%7B%7D',
      }] as any);

    expect(retrieveRawLaunchParams()).toBe('tgWebAppStartParam=performance&tgWebAppPlatform=macos&tgWebAppVersion=7.3&tgWebAppThemeParams=%7B%7D');
  });
});

describe('session storage contains launch params', () => {
  it('should return launch parameters from the session storage tapps/launchParams key. If data is missing or invalid, throw an error', () => {
    const spy = vi
      .spyOn(sessionStorage, 'getItem')
      .mockImplementationOnce(() => '');
    expect(() => retrieveRawLaunchParams()).toThrow();

    spy.mockClear();
    spy.mockImplementationOnce(() => {
      return '"tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppVersion=7.5"';
    });
    expect(retrieveRawLaunchParams()).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppVersion=7.5');
  });
});