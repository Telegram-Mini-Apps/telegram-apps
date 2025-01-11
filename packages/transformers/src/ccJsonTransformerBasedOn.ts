import {
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  parse,
  pipe,
  type SchemaWithPipe,
  string,
  type StringSchema,
  transform,
  type TransformAction,
} from 'valibot';

import { type DeepConvertSnakeKeysToCamelCase, deepSnakeToCamelObjKeys } from '@telegram-apps/toolkit';

export interface CCJsonTransformer<Schema extends BaseSchema<unknown, object, BaseIssue<unknown>>> {
  <CamelCase extends boolean | undefined>(camelCase?: CamelCase): SchemaWithPipe<[
    StringSchema<undefined>,
    TransformAction<
      string,
      CamelCase extends true
        ? DeepConvertSnakeKeysToCamelCase<InferOutput<Schema>>
        : InferOutput<Schema>
    >,
  ]>;
}

/**
 * Creates a transformer accepting a JSON object presented as string and returning a value based
 * on the passed schema.
 * @param schema - schema to use to transform the output
 */
export function ccJsonTransformerBasedOn<Schema extends BaseSchema<unknown, object, BaseIssue<unknown>>>(
  schema: Schema,
): CCJsonTransformer<Schema> {
  return (
    <CamelCase extends boolean | undefined>(camelCase?: CamelCase) => pipe(
      string(),
      transform(input => {
        const parsed = parse(schema, JSON.parse(input));
        return camelCase ? deepSnakeToCamelObjKeys(parsed) : parsed;
      }),
    )
  ) as CCJsonTransformer<Schema>;
}