import {
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  pipe,
  type SchemaWithPipe,
} from 'valibot';

import {
  conditionalSnakeKeys,
  type ConditionalSnakeKeysAction,
} from '@/camel-casing/conditionalSnakeKeys.js';
import type { CamelCaseTransformerFn } from '@/camel-casing/types.js';

type RequiredSchema = BaseSchema<unknown, object, BaseIssue<unknown>>;

export type CamelCaseTransformerPipe<Schema extends RequiredSchema, CamelCase extends boolean> =
  SchemaWithPipe<[
    Schema,
    ConditionalSnakeKeysAction<InferOutput<Schema>, CamelCase>
  ]>;

export type CamelCaseTransformer<Schema extends RequiredSchema> = CamelCaseTransformerFn<
  CamelCaseTransformerPipe<Schema, false>,
  CamelCaseTransformerPipe<Schema, true>
>;

/**
 * Creates a function that generates schemas deeply camel-casing output keys if needed.
 * @param schema - base schema used to validate the input.
 */
export function createCamelCaseGen<Schema extends RequiredSchema>(
  schema: Schema,
): CamelCaseTransformer<Schema> {
  return ((camelCase?) => pipe(
    schema,
    conditionalSnakeKeys(camelCase as any),
  )) as CamelCaseTransformer<Schema>;
}
