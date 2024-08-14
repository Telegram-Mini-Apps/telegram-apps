import { toSearchParams } from 'test-utils';
import { expect, it } from 'vitest';

import { parseLaunchParams } from './parseLaunchParams.js';

const baseLaunchParams = {
  tgWebAppPlatform: 'desktop',
  tgWebAppThemeParams: {},
  tgWebAppVersion: '7.0',
};

it(`should not throw if ${['tgWebAppBotInline', 'tgWebAppData', 'tgWebAppShowSettings', 'tgWebAppStartParam'].join(', ')} parameters are missing`, () => {
  expect(() => parseLaunchParams(toSearchParams(baseLaunchParams))).not.toThrow();
});

it('should create "botInline" property from the "tgWebAppBotInline" as boolean', () => {
  expect(
    parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppBotInline: false })),
  ).toMatchObject({ botInline: false });
  expect(
    () => parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppBotInline: 'str' })),
  ).toThrow();
});

it('should create "initData" property from the "tgWebAppData" as init data', () => {
  expect(
    parseLaunchParams(toSearchParams({
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
    parseLaunchParams(toSearchParams({
      ...baseLaunchParams,
      tgWebAppData: toSearchParams({ auth_date: 1, hash: 'abc' }),
    })),
  ).toMatchObject({ initDataRaw: 'auth_date=1&hash=abc' });
  // todo: err
});

it('should create "platform" property from the "tgWebAppPlatform" as string', () => {
  expect(
    parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppPlatform: 'tdesktop' })),
  ).toMatchObject({ platform: 'tdesktop' });
});

it('should create "showSettings" property from the "tgWebAppShowSettings" as boolean', () => {
  expect(
    parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppShowSettings: false })),
  ).toMatchObject({ showSettings: false });
  expect(
    () => parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppShowSettings: {} })),
  ).toThrow();
});

it('should create "startParam" property from the "tgWebAppPlatform" as string', () => {
  expect(
    parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppStartParam: 'start-param' })),
  ).toMatchObject({ startParam: 'start-param' });
});

it('should create "themeParams" property from the "tgWebAppThemeParams" as theme params', () => {
  expect(
    parseLaunchParams(toSearchParams({
      ...baseLaunchParams,
      tgWebAppThemeParams: JSON.stringify({ bg_color: '#000' }),
    })),
  ).toMatchObject({
    themeParams: {
      bgColor: '#000000',
    },
  });
  expect(
    () => parseLaunchParams(toSearchParams({ ...baseLaunchParams, tgWebAppThemeParams: '' })),
  ).toThrow();
});
