import { expect, it } from 'vitest';

import { serializeLaunchParams } from '@/scopes/launch-params/serializeLaunchParams.js';

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
