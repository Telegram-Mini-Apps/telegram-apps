import {
  type BaseIssue,
  type BaseSchema,
  pipe,
  type SchemaWithPipe,
  string,
  type StringSchema,
  type TransformAction,
} from 'valibot';

import {
  type CamelCaseTransformerPipe,
  createCamelCaseGen,
} from '@/camel-casing/createCamelCaseGen.js';
import type { CamelCaseTransformerFn } from '@/camel-casing/types.js';
import { jsonParse } from '@/transformers/jsonParse.js';

type RequiredSchema = BaseSchema<unknown, object, BaseIssue<unknown>>;

export type CamelCaseJsonTransformerPipe<
  Schema extends RequiredSchema,
  CamelCase extends boolean
> = SchemaWithPipe<[
  StringSchema<undefined>,
  TransformAction<string, unknown>,
  CamelCaseTransformerPipe<Schema, CamelCase>,
]>;

export type CamelCaseJsonTransformer<Schema extends RequiredSchema> = CamelCaseTransformerFn<
  CamelCaseJsonTransformerPipe<Schema, false>,
  CamelCaseJsonTransformerPipe<Schema, true>
>;

/**
 * Creates a transformer accepting a JSON object presented as string and returning a value based
 * on the passed schema.
 * @param schema - schema to use to transform the output
 */
export function createJsonCamelCaseGen<Schema extends RequiredSchema>(
  schema: Schema,
): CamelCaseJsonTransformer<Schema> {
  const cc = createCamelCaseGen(schema);

  return ((camelCase?) => pipe(
    string(),
    jsonParse(),
    cc(camelCase as any),
  )) as CamelCaseJsonTransformer<Schema>;
}