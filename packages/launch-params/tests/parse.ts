import { describe, it, expect } from 'vitest';

import { parse } from '../src/index.js';
import type { LaunchParams } from '../src/index.js';

type ConstructLaunchParamsOptions = Partial<Omit<LaunchParams, 'initData'>>;

/**
 * Constructs search params representing launch parameters.
 * @param lp
 */
function constructLaunchParams(lp: ConstructLaunchParamsOptions = {}): URLSearchParams {
  const {
    version,
    themeParams,
    platform,
    initDataRaw,
  } = lp;
  const params = new URLSearchParams();

  if (themeParams) {
    const {
      backgroundColor,
      secondaryBackgroundColor,
      buttonTextColor,
      textColor,
      linkColor,
      hintColor,
      buttonColor,
    } = themeParams;
    params.set('tgWebAppThemeParams', JSON.stringify({
      bg_color: backgroundColor,
      secondary_bg_color: secondaryBackgroundColor,
      button_text_color: buttonTextColor,
      text_color: textColor,
      link_color: linkColor,
      hint_color: hintColor,
      button_color: buttonColor,
    }));
  }

  if (version) {
    params.set('tgWebAppVersion', version);
  }

  if (platform) {
    params.set('tgWebAppPlatform', platform);
  }

  if (initDataRaw) {
    params.set('tgWebAppData', initDataRaw);
  }

  return params;
}

describe('parse.ts', () => {
  describe('parse', () => {
    it('should throw if tgWebAppVersion, tgWebAppPlatform or tgWebAppThemeParams are missing', () => {
      expect(() => parse('')).toThrow();
      expect(() => parse(constructLaunchParams({
        version: '6.10',
      }))).toThrow();
      expect(() => parse(constructLaunchParams({
        version: '6.10',
        platform: 'macos',
      }))).toThrow();
      expect(() => parse(constructLaunchParams({
        version: '6.10',
        themeParams: {},
      }))).toThrow();

      expect(() => parse(constructLaunchParams({
        version: '6.10',
        platform: 'macos',
        themeParams: {},
      }))).not.toThrow();
    });

    describe('tgWebAppVersion', () => {
      it('should map property to property with name "version"', () => {
        const params = 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams={}';
        expect(parse(params)).toMatchObject({ version: '6.10' });
      });
    });

    describe('tgWebAppPlatform', () => {
      it('should map property to property with name "platform"', () => {
        const params = 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams={}';
        expect(parse(params)).toMatchObject({ platform: 'macos' });
      });
    });

    describe('tgWebAppThemeParams', () => {
      it('should map property to property with name "themeParams" applying theme params parser', () => {
        const params = 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D';
        expect(parse(params)).toMatchObject({
          themeParams: {
            backgroundColor: '#ffffff',
          },
        });
      });
    });

    describe('tgWebAppData', () => {
      it('should map property to property with name "initData" applying init data parser', () => {
        const params = 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppData=auth_date%3D1696440047%26hash%3Dabc';
        expect(parse(params)).toMatchObject({
          initData: {
            authDate: new Date(1696440047000),
            hash: 'abc',
          },
        });
      });

      it('should map property to property with name "initDataRaw" saving string format', () => {
        const params = 'tgWebAppVersion=6.10&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%7D&tgWebAppData=auth_date%3D1696440047%26hash%3Dabc';
        expect(parse(params)).toMatchObject({
          initDataRaw: 'auth_date=1696440047&hash=abc',
        });
      });
    });
  });
});
