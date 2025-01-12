import {
  optional,
  string,
  looseObject,
  pipe,
  transform,
  type InferOutput,
  type BaseSchema,
} from 'valibot';
import type { LaunchParams } from '@telegram-apps/types';

import { themeParams } from '@/themeParams.js';
import { initDataQuery, serializeInitDataQuery } from '@/init-data.js';
import { serializeToQuery } from '@/serializeToQuery.js';
import { ccQueryTransformerBasedOn } from '@/ccQueryTransformerBasedOn.js';
import { ccJsonTransformerBasedOn } from '@/ccJsonTransformerBasedOn.js';

const OptionalBoolean = optional(
  pipe(string(), transform(v => v === '1')),
);
const tp = ccJsonTransformerBasedOn(themeParams());

const schema = looseObject({
  tgWebAppBotInline: OptionalBoolean,
  tgWebAppData: optional(initDataQuery()),
  tgWebAppDefaultColors: optional(tp()),
  tgWebAppFullscreen: OptionalBoolean,
  tgWebAppPlatform: string(),
  tgWebAppShowSettings: OptionalBoolean,
  tgWebAppStartParam: optional(string()),
  tgWebAppThemeParams: tp(),
  tgWebAppVersion: string(),
} satisfies {
  [K in keyof LaunchParams]-?: BaseSchema<unknown, LaunchParams[K], any>;
});

export const launchParamsQuery = ccQueryTransformerBasedOn(schema);

export type LaunchParamsShape = InferOutput<typeof schema>;

/**
 * Serializes the LaunchParamsQuery shape.
 * @param value - value to serialize.
 */
export function serializeLaunchParamsQuery(value: LaunchParamsShape | LaunchParams): string {
  return serializeToQuery(value, (k, v) => {
    return k === 'tgWebAppData' ? serializeInitDataQuery(v as any) : JSON.stringify(v);
  });
}