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

import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
} from '@telegram-apps/toolkit';

export type CCJsonTransformerPipe<Output> = SchemaWithPipe<[
  StringSchema<undefined>,
  TransformAction<string, Output>
]>;

export interface CCJsonTransformer<Schema extends BaseSchema<unknown, object, BaseIssue<unknown>>> {
  (camelCase?: false): CCJsonTransformerPipe<InferOutput<Schema>>;
  (camelCase: true): CCJsonTransformerPipe<DeepConvertSnakeKeysToCamelCase<InferOutput<Schema>>>;
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