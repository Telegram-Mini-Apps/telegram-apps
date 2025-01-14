import {
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  instance, type InstanceSchema, parse,
  pipe,
  type SchemaWithPipe,
  string,
  type StringSchema,
  transform,
  TransformAction,
  union,
  type UnionSchema,
} from 'valibot';

import {
  conditionalSnakeKeys,
  type ConditionalSnakeKeysAction,
} from '@/camel-casing/conditionalSnakeKeys.js';
import type { CamelCaseTransformerFn } from '@/camel-casing/types.js';

type RequiredSchema = BaseSchema<object, object, BaseIssue<unknown>>;

export type CamelCaseQueryTransformerPipe<
  Schema extends RequiredSchema,
  CamelCase extends boolean
> = SchemaWithPipe<[
  UnionSchema<[
    StringSchema<undefined>,
    InstanceSchema<typeof URLSearchParams, undefined>
  ], undefined>,
  TransformAction<string | URLSearchParams, InferOutput<Schema>>,
  ConditionalSnakeKeysAction<InferOutput<Schema>, CamelCase>
]>;

export type CamelCaseQueryTransformer<Schema extends RequiredSchema> = CamelCaseTransformerFn<
  CamelCaseQueryTransformerPipe<Schema, false>,
  CamelCaseQueryTransformerPipe<Schema, true>
>;

/**
 * Creates a transformer accepting query parameters as string and returning a value based
 * on the passed schema.
 * @param schema - schema to use to transform the output
 */
export function createQueryCamelCaseGen<Schema extends RequiredSchema>(
  schema: Schema,
): CamelCaseQueryTransformer<Schema> {
  return ((camelCase?) => pipe(
    union([string(), instance(URLSearchParams)]),
    transform(input => {
      const result: Record<string, string | string[]> = {};

      new URLSearchParams(input).forEach((value, key) => {
        const accValue = result[key];
        if (accValue === undefined || !Array.isArray(accValue)) {
          result[key] = value;
        } else {
          accValue.push(value);
        }
      });

      return parse(schema, result);
    }),
    conditionalSnakeKeys<any>(camelCase),
  )) as CamelCaseQueryTransformer<Schema>;
}