import {
  check,
  type CheckAction,
  pipe,
  record,
  type RecordSchema,
  type SchemaWithPipe,
  string,
  type StringSchema,
  transform,
  type TransformAction,
} from 'valibot';
import { snakeToCamel } from '@telegram-apps/toolkit';
import type { RGB, KnownThemeParamsKeyCamelCased, KnownThemeParamsKey } from '@telegram-apps/types';

import { isRGB } from '@/rgb.js';

type ThemeParamsSchema<Key extends string> = RecordSchema<
  SchemaWithPipe<[
    StringSchema<undefined>,
    TransformAction<string, Key>,
  ]>,
  SchemaWithPipe<[
    StringSchema<undefined>,
    CheckAction<string, undefined>,
    TransformAction<string, RGB>
  ]>,
  undefined
>;

/**
 * Returns a validator checking if the passed type describes theme parameters, which is record
 * with string keys and RGB values.
 * @param camelCase - true if the camel case conversion is required.
 */
export function themeParams(camelCase?: false): ThemeParamsSchema<KnownThemeParamsKey>;

/**
 * Returns a validator checking if the passed type describes theme parameters, which is record
 * with string keys and RGB values.
 * It also converts keys from snake case to camel case.
 * @param camelCase - true if the camel case conversion is required.
 */
export function themeParams(camelCase: true): ThemeParamsSchema<KnownThemeParamsKeyCamelCased>;
export function themeParams(camelCase?: boolean): ThemeParamsSchema<string> {
  return record(
    pipe(string(), transform(camelCase ? snakeToCamel : input => input)),
    pipe(string(), check(isRGB), transform(input => input as RGB)),
  );
}