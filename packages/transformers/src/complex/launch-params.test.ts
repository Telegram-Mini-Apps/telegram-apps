import { toSearchParams } from 'test-utils';
import { describe, expect, it } from 'vitest';

import { launchParams, serializeLaunchParams } from './launch-params.js';

describe('launchParams', () => {
  const baseLaunchParams = {
    tgWebAppPlatform: 'desktop',
    tgWebAppThemeParams: {},
    tgWebAppVersion: '7.0',
  };

  it(`should not throw if ${['tgWebAppBotInline', 'tgWebAppData', 'tgWebAppShowSettings', 'tgWebAppStartParam'].join(', ')} parameters are missing`, () => {
    expect(() => launchParams()(toSearchParams(baseLaunchParams))).not.toThrow();
  });

  it('should create "botInline" property from the "tgWebAppBotInline" as boolean', () => {
    expect(
      launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppBotInline: false })),
    ).toMatchObject({ botInline: false });
    expect(
      () => launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppBotInline: 'str' })),
    ).toThrow();
  });

  it('should create "initData" property from the "tgWebAppData" as init data', () => {
    expect(
      launchParams()(toSearchParams({
        ...baseLaunchParams,
        tgWebAppData: toSearchParams({ auth_date: 1, hash: 'abc' }),
      })),
    ).toMatchObject({
      initData: {
        authDate: new Date(1000),
        hash: 'abc',
      },
    });
    // TODO: err
  });

  it('should create "initDataRaw" property from the "tgWebAppData" as string', () => {
    expect(
      launchParams()(toSearchParams({
        ...baseLaunchParams,
        tgWebAppData: toSearchParams({ auth_date: 1, hash: 'abc' }),
      })),
    ).toMatchObject({ initDataRaw: 'auth_date=1&hash=abc' });
    // todo: err
  });

  it('should create "platform" property from the "tgWebAppPlatform" as string', () => {
    expect(
      launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppPlatform: 'tdesktop' })),
    ).toMatchObject({ platform: 'tdesktop' });
  });

  it('should create "showSettings" property from the "tgWebAppShowSettings" as boolean', () => {
    expect(
      launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppShowSettings: false })),
    ).toMatchObject({ showSettings: false });
    expect(
      () => launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppShowSettings: {} })),
    ).toThrow();
  });

  it('should create "startParam" property from the "tgWebAppPlatform" as string', () => {
    expect(
      launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppStartParam: 'start-param' })),
    ).toMatchObject({ startParam: 'start-param' });
  });

  it('should create "themeParams" property from the "tgWebAppThemeParams" as theme params', () => {
    expect(
      launchParams()(toSearchParams({
        ...baseLaunchParams,
        tgWebAppThemeParams: JSON.stringify({ bg_color: '#000' }),
      })),
    ).toMatchObject({
      themeParams: {
        bgColor: '#000000',
      },
    });
    expect(
      () => launchParams()(toSearchParams({ ...baseLaunchParams, tgWebAppThemeParams: '' })),
    ).toThrow();
  });
});

describe('serializeLaunchParams', () => {
  it('should emit tgWebAppPlatform = platform, tgWebAppThemeParams = serialized themeParams, and tgWebAppVersion = version, if only required properties are specified', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0');
  });

  it('should append tgWebAppData = initDataRaw, if specified', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
      initDataRaw: 'init-data-raw',
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0&tgWebAppData=init-data-raw');
  });

  it('should append tgWebAppStartParam = startParam, if specified', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
      startParam: 'start-param',
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0&tgWebAppStartParam=start-param');
  });

  it('should append tgWebAppShowSettings = showSettings, if specified', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
      showSettings: true,
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0&tgWebAppShowSettings=1');
  });

  it('should append tgWebAppBotInline = botInline, if specified', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
      botInline: true,
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0&tgWebAppBotInline=1');
  });

  it('should append all optional properties', () => {
    expect(serializeLaunchParams({
      platform: 'android',
      themeParams: {},
      version: '7.0',
      initDataRaw: 'init-data-raw',
      startParam: 'start-param',
      showSettings: true,
      botInline: true,
    })).toBe('tgWebAppPlatform=android&tgWebAppThemeParams=%7B%7D&tgWebAppVersion=7.0&tgWebAppData=init-data-raw&tgWebAppStartParam=start-param&tgWebAppShowSettings=1&tgWebAppBotInline=1');
  });
});