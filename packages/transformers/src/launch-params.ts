import { optional, string, looseObject, pipe, transform, parse } from 'valibot';
import type { LaunchParams } from '@telegram-apps/types';

import { jsonParse, query, queryToRecord, transformUsing } from '@/transformers.js';
import { ThemeParams, ThemeParamsCamelCased } from '@/theme-params.js';
import { InitDataQuery, InitDataQueryCamelCased } from '@/init-data.js';

const defaultedBoolean = optional(
  pipe(string(), transform(v => v === '1')),
  '',
);
const themeParams = pipe(string(), jsonParse(), ThemeParams);
const themeParamsCC = pipe(string(), jsonParse(), ThemeParamsCamelCased);

const schema = looseObject({
  tgWebAppBotInline: defaultedBoolean,
  tgWebAppData: optional(InitDataQuery),
  tgWebAppDefaultColors: optional(themeParams, '{}'),
  tgWebAppFullscreen: defaultedBoolean,
  tgWebAppPlatform: string(),
  tgWebAppShowSettings: defaultedBoolean,
  tgWebAppStartParam: optional(string()),
  tgWebAppThemeParams: themeParams,
  tgWebAppVersion: string(),
});

/**
 * Transformer extracting launch parameters in its initial format from the query parameters.
 */
export const LaunchParamsQuery = pipe(
  query(),
  queryToRecord(),
  transformUsing(schema),
);

/**
 * Transformer extracting launch parameters from the query parameters and converting them to
 * interface described in @telegram-apps/types.
 */
export const LaunchParamsPrepared = pipe(
  query(),
  queryToRecord(),
  transform((query): LaunchParams => {
    const partial = parse(
      looseObject({ tgWebAppData: optional(string()) }),
      query,
    );
    const complete = parse(looseObject({
      ...schema.entries,
      tgWebAppData: optional(InitDataQueryCamelCased),
      tgWebAppDefaultColors: optional(themeParamsCC, '{}'),
      tgWebAppThemeParams: themeParamsCC,
    }), query);

    return {
      platform: complete.tgWebAppPlatform,
      startParam: complete.tgWebAppStartParam,
      version: complete.tgWebAppVersion,
      themeParams: complete.tgWebAppThemeParams,
      initDataRaw: partial.tgWebAppData,
      botInline: complete.tgWebAppBotInline,
      fullscreen: complete.tgWebAppFullscreen,
      initData: complete.tgWebAppData,
      showSettings: complete.tgWebAppShowSettings,
      defaultColors: complete.tgWebAppDefaultColors,
    };
  }),
);