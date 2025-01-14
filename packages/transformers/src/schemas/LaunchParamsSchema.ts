import { type BaseSchema, looseObject, optional, pipe, string, transform } from 'valibot';
import type { LaunchParams } from '@telegram-apps/types';

import { themeParams } from '@/generators/themeParams.js';
import { initDataQuery } from '@/generators/init-data.js';
import { createJsonCamelCaseGen } from '@/camel-casing/createJsonCamelCaseGen.js';

const OptionalBoolean = optional(
  pipe(string(), transform(v => v === '1')),
);
const themeParamsJson = createJsonCamelCaseGen(themeParams());

export const LaunchParamsSchema = looseObject({
  tgWebAppBotInline: OptionalBoolean,
  tgWebAppData: optional(initDataQuery()),
  tgWebAppDefaultColors: optional(themeParamsJson()),
  tgWebAppFullscreen: OptionalBoolean,
  tgWebAppPlatform: string(),
  tgWebAppShowSettings: OptionalBoolean,
  tgWebAppStartParam: optional(string()),
  tgWebAppThemeParams: themeParamsJson(),
  tgWebAppVersion: string(),
} satisfies { [K in keyof LaunchParams]-?: BaseSchema<unknown, LaunchParams[K], any> });