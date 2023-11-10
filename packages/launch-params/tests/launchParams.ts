import { describe, expect, it } from 'vitest';
import { toSearchParams } from 'test-utils';

import { launchParams } from '../src/index.js';

describe('launchParams', () => {
  describe('botInline', () => {
    it('should extract "tgWebAppBotInline" and parse it as boolean', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
          tgWebAppBotInline: true,
        })),
      ).toMatchObject({
        botInline: true,
      });
    });
  });

  describe('initData', () => {
    it('should extract "tgWebAppData" property and parse it as InitData', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
          tgWebAppData: toSearchParams({
            hash: 'myhash',
            auth_date: 1,
          }),
        })),
      ).toMatchObject({
        initData: {
          hash: 'myhash',
          authDate: new Date(1000),
        },
      });
    });
  });

  describe('initDataRaw', () => {
    it('should extract "tgWebAppData" property and parse it as string', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
          tgWebAppData: toSearchParams({
            hash: 'myhash',
            auth_date: 1,
          }),
        })),
      ).toMatchObject({
        initDataRaw: 'hash=myhash&auth_date=1',
      });
    });
  });

  describe('platform', () => {
    it('should throw an error in case "tgWebAppPlatform" is missing', () => {
      expect(
        () => launchParams().parse(toSearchParams({
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
        })),
      ).toThrow();
    });

    it('should extract "tgWebAppPlatform" and parse it as string', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
        })),
      ).toMatchObject({
        platform: 'webz',
      });
    });
  });

  describe('showSettings', () => {
    it('should extract "tgWebAppShowSettings" and parse it as boolean', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
          tgWebAppShowSettings: true,
        })),
      ).toMatchObject({
        showSettings: true,
      });
    });
  });

  describe('themeParams', () => {
    it('should throw an error in case, "tgWebAppThemeParams" property is missing', () => {
      expect(
        () => launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppVersion: '6.9',
        })),
      ).toThrow();
    });

    it('should extract "tgWebAppThemeParams" property and parse it as ThemeParams', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {
            bg_color: '#aaf132',
          },
          tgWebAppVersion: '6.9',
        })),
      ).toMatchObject({
        themeParams: {
          backgroundColor: '#aaf132',
        },
      });
    });
  });

  describe('version', () => {
    it('should throw an error in case "tgWebAppVersion" is missing', () => {
      expect(
        () => launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
        })),
      ).toThrow();
    });

    it('should extract "tgWebAppVersion" and parse it as string', () => {
      expect(
        launchParams().parse(toSearchParams({
          tgWebAppPlatform: 'webz',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '6.9',
        })),
      ).toMatchObject({
        version: '6.9',
      });
    });
  });
});
