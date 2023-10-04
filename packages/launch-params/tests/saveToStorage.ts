import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { SpyInstance } from 'vitest';

import { saveToStorage } from '../src/index.js';

let sessionStorageSpy: SpyInstance<[], Storage>;

beforeAll(() => {
  sessionStorageSpy = vi.spyOn(window, 'sessionStorage', 'get');
});

afterEach(() => {
  sessionStorageSpy.mockReset();
});

describe('saveToStorage.ts', () => {
  describe('saveToStorage', () => {
    it('should use key "telegram-mini-apps-launch-params" to save in session storage', () => {
      const setItemSpy = vi.fn();
      sessionStorageSpy.mockImplementation(() => ({
        setItem: setItemSpy,
      }) as any);

      saveToStorage({
        version: '6.10',
        platform: 'macos',
        themeParams: {},
      });

      expect(setItemSpy).toHaveBeenCalledWith('telegram-mini-apps-launch-params', expect.anything());
    });

    it('should convert passed object to search params with fields "tgWebAppVersion", "tgWebAppPlatform", "tgWebAppThemeParams" and "tgWebAppData"', () => {
      const setItemSpy = vi.fn();
      sessionStorageSpy.mockImplementation(() => ({
        setItem: setItemSpy,
      }) as any);

      saveToStorage({
        version: '6.10',
        platform: 'macos',
        themeParams: {
          backgroundColor: '#aaaaaa',
        },
        initDataRaw: 'some-custom-data',
      });

      expect(setItemSpy).toHaveBeenLastCalledWith(expect.anything(), 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22backgroundColor%22%3A%22%23aaaaaa%22%7D&tgWebAppData=some-custom-data');

      saveToStorage({
        version: '6.10',
        platform: 'macos',
        themeParams: {
          backgroundColor: '#aaaaaa',
        },
      });

      expect(setItemSpy).toHaveBeenLastCalledWith(expect.anything(), 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22backgroundColor%22%3A%22%23aaaaaa%22%7D');
    });
  });
});
