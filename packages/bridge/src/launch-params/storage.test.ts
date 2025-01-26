import { afterEach, describe, expect, it, vi } from 'vitest';

import { retrieveFromStorage, saveToStorage } from './storage.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('retrieveFromStorage', () => {
  it('should return launch parameters from the session storage tapps/launchParams key. If data is missing or invalid, throw an error', () => {
    const spy = vi
      .spyOn(sessionStorage, 'getItem')
      .mockImplementationOnce(() => '');
    expect(() => retrieveFromStorage()).toThrow();

    spy.mockClear();
    spy.mockImplementationOnce(() => {
      return '"tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppVersion=7.0"';
    });
    expect(retrieveFromStorage()).toStrictEqual({
      tgWebAppVersion: '7.0',
      tgWebAppPlatform:'android',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
      },
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('tapps/launchParams');
  });
});

describe('retrieveFromStorage', () => {
  it('should call sessionStorage.setItem with "tapps/launchParams" and serialized launch params', () => {
    const spy = vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => undefined);
    saveToStorage({
      tgWebAppVersion: '7.0',
      tgWebAppPlatform:'android',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
      },
    });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      'tapps/launchParams',
      '"tgWebAppVersion=7.0&tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D"',
    );
  });
});
