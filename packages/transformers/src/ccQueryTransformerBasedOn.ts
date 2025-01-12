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
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
} from '@telegram-apps/toolkit';

type RequiredSchema = BaseSchema<unknown, object, BaseIssue<unknown>>;

export type CCQueryTransformerPipe<Output> = SchemaWithPipe<[
  UnionSchema<[
    StringSchema<undefined>,
    InstanceSchema<typeof URLSearchParams, undefined>
  ], undefined>,
  TransformAction<
    string | URLSearchParams,
    Output
  >,
]>

export interface CCQueryTransformer<Schema extends RequiredSchema> {
  (camelCase?: false): CCQueryTransformerPipe<InferOutput<Schema>>;
  (camelCase: true): CCQueryTransformerPipe<DeepConvertSnakeKeysToCamelCase<InferOutput<Schema>>>;
}

/**
 * Creates a transformer accepting query parameters as string and returning a value based
 * on the passed schema.
 * @param schema - schema to use to transform the output
 */
export function ccQueryTransformerBasedOn<Schema extends RequiredSchema>(
  schema: Schema,
): CCQueryTransformer<Schema> {
  return (
    <CamelCase extends boolean | undefined>(camelCase?: CamelCase) => pipe(
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

        const parsed = parse(schema, result);
        return camelCase ? deepSnakeToCamelObjKeys(parsed) : parsed;
      }),
    )
  ) as CCQueryTransformer<Schema>;
}