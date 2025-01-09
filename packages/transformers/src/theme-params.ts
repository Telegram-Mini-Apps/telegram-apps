import {
  check,
  type CheckAction, InferOutput,
  pipe,
  record,
  type RecordSchema,
  type SchemaWithPipe,
  string,
  type StringSchema,
  transform,
  type TransformAction,
} from 'valibot';
import { snakeToCamelObjKeys } from '@telegram-apps/toolkit';
import type { RGB, ThemeParamsKey } from '@telegram-apps/types';

import { isRGB } from '@/rgb.js';

/**
 * Validator checking if the passed type describes theme parameters, which is record with string
 * keys and RGB values.
 */
export const ThemeParams: RecordSchema<
  StringSchema<undefined>,
  SchemaWithPipe<[
    StringSchema<undefined>,
    CheckAction<string, undefined>,
    TransformAction<string, RGB>
  ]>,
  undefined
> = record(
  string(),
  pipe(string(), check(isRGB), transform(input => input as RGB)),
);

/**
 * Transformer converting theme parameters object keys from snake to camel case.
 */
export const ThemeParamsCamelCased: SchemaWithPipe<[
  typeof ThemeParams,
  TransformAction<
    InferOutput<typeof ThemeParams>,
    Record<ThemeParamsKey | string, RGB>
  >
]> = pipe(ThemeParams, transform(snakeToCamelObjKeys));
