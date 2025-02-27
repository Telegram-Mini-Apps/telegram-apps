import {
  check,
  type CheckAction,
  number,
  type NumberSchema,
  pipe,
  record,
  type RecordSchema,
  type SchemaWithPipe,
  string,
  type StringSchema,
  transform,
  type TransformAction,
  union,
  type UnionSchema,
} from 'valibot';
import type { RGB, KnownThemeParamsKey } from '@telegram-apps/types';

import {
  type CamelCaseTransformer,
  createCamelCaseGen,
} from '@/camel-casing/createCamelCaseGen.js';
import { isRGB } from '@/validation/rgb.js';

export const themeParams = createCamelCaseGen(
  record(
    string(),
    pipe(
      union([string(), number()]),
      transform(value => {
        return typeof value === 'number'
          ? `#${(value & 0x00FFFFFF).toString(16).padStart(6, '0')}`
          : value;
      }),
      check(isRGB),
    ),
  ),
) as CamelCaseTransformer<
  RecordSchema<
    SchemaWithPipe<[
      StringSchema<undefined>,
      TransformAction<string, KnownThemeParamsKey>,
    ]>,
    SchemaWithPipe<[
      UnionSchema<[StringSchema<undefined>, NumberSchema<undefined>], any>,
      TransformAction<string | number, string>,
      CheckAction<RGB, undefined>
    ]>,
    undefined
  >
>;