import type { LaunchParams } from './types.js';
import { initDataParser } from '../components/init-data/initDataParser.js';
import { themeParamsParser } from '../components/theme-params/themeParamsParser.js';
import { boolean } from '../parsing/parsers/boolean.js';
import { searchParams } from '../parsing/parsers/searchParams.js';
import { string } from '../parsing/parsers/string.js';
import type { ValueParser } from '../parsing/ValueParser.js';

/**
 * Returns parser used to parse launch params.
 */
export function launchParamsParser(): ValueParser<LaunchParams, false> {
  return searchParams<LaunchParams>({
    botInline: {
      type: boolean().optional(),
      from: 'tgWebAppBotInline',
    },
    initData: {
      type: initDataParser().optional(),
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
      type: themeParamsParser(),
      from: 'tgWebAppThemeParams',
    },
    version: {
      type: string(),
      from: 'tgWebAppVersion',
    },
  }, 'LaunchParams');
}
