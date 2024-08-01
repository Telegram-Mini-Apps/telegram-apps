import type { LaunchParams } from '@telegram-apps/types';

import type { ValueParser } from '@/ValueParser/ValueParser.js';

import { searchParams } from './searchParams.js';
import { boolean } from './boolean.js';
import { string } from './string.js';
import { initData } from './initData.js';
import { themeParams } from './themeParams.js';

export type { LaunchParams };

export function launchParams(): ValueParser<LaunchParams, false> {
  return searchParams({
    botInline: {
      type: boolean().optional(),
      from: 'tgWebAppBotInline',
    },
    initData: {
      type: initData().optional(),
      from: 'tgWebAppData',
    },
    initDataRaw: {
      type: string().optional(),
      from: 'tgWebAppData',
    },
    platform: {
      type: string(),
      from: 'tgWebAppPlatform',
    },
    showSettings: {
      type: boolean().optional(),
      from: 'tgWebAppShowSettings',
    },
    startParam: {
      type: string().optional(),
      from: 'tgWebAppStartParam',
    },
    themeParams: {
      type: themeParams(),
      from: 'tgWebAppThemeParams',
    },
    version: {
      type: string(),
      from: 'tgWebAppVersion',
    },
  });
}