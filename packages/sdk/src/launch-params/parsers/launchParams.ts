import { initData } from '@/components/init-data/parsers/initData.js';
import { themeParams } from '@/components/theme-params/parsing/themeParams.js';
import { boolean } from '@/parsing/parsers/boolean.js';
import { searchParams } from '@/parsing/parsers/searchParams.js';
import { string } from '@/parsing/parsers/string.js';
import type { ValueParser } from '@/parsing/ValueParser/ValueParser.js';

import type { LaunchParams } from '../types.js';

/**
 * Returns parser used to parse launch params.
 */
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
  }, 'LaunchParams');
}
