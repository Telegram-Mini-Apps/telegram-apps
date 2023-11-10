import { describe, expect, it } from 'vitest';
import { toSearchParams } from 'test-utils';

import { serialize } from '../src/index.js';

describe('serialize', () => {
  it('should convert launch params to search parameters in the order: tgWebAppData, tgWebAppPlatform, tgWebAppThemeParams, tgWebAppVersion, tgWebAppShowSettings, tgWebAppBotInline', () => {
    expect(serialize({
      version: '6.3',
      platform: 'web',
      botInline: true,
      showSettings: true,
      initDataRaw: toSearchParams({
        auth_date: 13,
        hash: 'abc123',
      }),
      themeParams: {
        backgroundColor: '#aabbcc',
      },
    })).toBe('tgWebAppData=auth_date%3D13%26hash%3Dabc123&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23aabbcc%22%7D&tgWebAppVersion=6.3&tgWebAppShowSettings=1&tgWebAppBotInline=1');

    expect(serialize({
      version: '6.3',
      platform: 'web',
      botInline: false,
      showSettings: false,
      initDataRaw: toSearchParams({
        auth_date: 13,
        hash: 'abc123',
      }),
      themeParams: {
        backgroundColor: '#aabbcc',
      },
    })).toBe('tgWebAppData=auth_date%3D13%26hash%3Dabc123&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23aabbcc%22%7D&tgWebAppVersion=6.3&tgWebAppShowSettings=0&tgWebAppBotInline=0');
  });
});
