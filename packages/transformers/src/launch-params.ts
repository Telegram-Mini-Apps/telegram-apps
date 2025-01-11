import { optional, string, looseObject, pipe, transform, type InferOutput } from 'valibot';

import { jsonParse, query, queryToRecord, transformUsing } from '@/transformers.js';
import { themeParams } from '@/themeParams.js';
import { InitDataQuery, serializeInitDataQuery } from '@/init-data.js';
import { serializeToQuery } from '@/serializeToQuery.js';

const defaultedBoolean = optional(
  pipe(string(), transform(v => v === '1')),
  '',
);
const tp = pipe(string(), jsonParse(), themeParams());

/**
 * Transformer extracting launch parameters in its initial format from the query parameters.
 */
export const LaunchParamsQuery = pipe(
  query(),
  queryToRecord(),
  transformUsing(looseObject({
    tgWebAppBotInline: defaultedBoolean,
    tgWebAppData: optional(InitDataQuery),
    tgWebAppDefaultColors: optional(tp, '{}'),
    tgWebAppFullscreen: defaultedBoolean,
    tgWebAppPlatform: string(),
    tgWebAppShowSettings: defaultedBoolean,
    tgWebAppStartParam: optional(string()),
    tgWebAppThemeParams: tp,
    tgWebAppVersion: string(),
  })),
);

/**
 * Serializes the LaunchParamsQuery shape.
 * @param value - value to serialize.
 */
export function serializeLaunchParamsQuery(value: InferOutput<typeof LaunchParamsQuery>): string {
  return serializeToQuery(value, (k, v) => {
    return k === 'tgWebAppData' ? serializeInitDataQuery(v as any) : JSON.stringify(v);
  });
}