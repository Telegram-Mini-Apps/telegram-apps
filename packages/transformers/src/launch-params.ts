import { optional, string, looseObject, pipe, transform, type InferOutput } from 'valibot';

import { themeParams } from '@/themeParams.js';
import { initData, serializeInitDataQuery } from '@/init-data.js';
import { serializeToQuery } from '@/serializeToQuery.js';
import { ccQueryTransformerBasedOn } from '@/ccQueryTransformerBasedOn.js';
import { ccJsonTransformerBasedOn } from '@/ccJsonTransformerBasedOn.js';

const OptionalBoolean = optional(
  pipe(string(), transform(v => v === '1')),
);
const tp = ccJsonTransformerBasedOn(themeParams());

const LaunchParamsObject = looseObject({
  tgWebAppBotInline: OptionalBoolean,
  tgWebAppData: optional(initData()),
  tgWebAppDefaultColors: optional(tp()),
  tgWebAppFullscreen: OptionalBoolean,
  tgWebAppPlatform: string(),
  tgWebAppShowSettings: OptionalBoolean,
  tgWebAppStartParam: optional(string()),
  tgWebAppThemeParams: tp(),
  tgWebAppVersion: string(),
});

export const launchParams = ccQueryTransformerBasedOn(LaunchParamsObject);

/**
 * Serializes the LaunchParamsQuery shape.
 * @param value - value to serialize.
 */
export function serializeLaunchParamsQuery(value: InferOutput<typeof LaunchParamsObject>): string {
  return serializeToQuery(value, (k, v) => {
    return k === 'tgWebAppData' ? serializeInitDataQuery(v as any) : JSON.stringify(v);
  });
}