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
import type { RGB, KnownThemeParamsKey } from '@telegram-apps/types';

import { isRGB } from '@/validation/rgb.js';
import {
  type CamelCaseTransformer,
  createCamelCaseGen,
} from '@/camel-casing/createCamelCaseGen.js';

export const themeParams = createCamelCaseGen(
  record(
    string(),
    pipe(string(), check(isRGB), transform(i => i as RGB)),
  ),
) as CamelCaseTransformer<
  RecordSchema<
    SchemaWithPipe<[
      StringSchema<undefined>,
      TransformAction<string, KnownThemeParamsKey>,
    ]>,
    SchemaWithPipe<[
      StringSchema<undefined>,
      CheckAction<string, undefined>,
      TransformAction<string, RGB>
    ]>,
    undefined
  >
>;