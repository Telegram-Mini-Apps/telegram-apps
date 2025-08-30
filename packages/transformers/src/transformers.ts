import {
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  parse,
  transform,
  type TransformAction,
} from 'valibot';

type RequiredSchema = BaseSchema<any, any, BaseIssue<any>>;

export type TransformJsonToSchemaAction = TransformAction<string, unknown>;

export type TransformQueryToSchemaAction<Schema extends RequiredSchema> =
  TransformAction<string | URLSearchParams, InferOutput<Schema>>;

export function transformQueryToSchema<Schema extends RequiredSchema>(
  schema: Schema,
): TransformQueryToSchemaAction<Schema> {
  return transform(input => {
    const result: Record<string, string | string[]> = {};

    new URLSearchParams(input).forEach((value, key) => {
      const accValue = result[key];
      if (Array.isArray(accValue)) {
        accValue.push(value);
      } else if (accValue === undefined) {
        result[key] = value;
      } else {
        result[key] = [accValue, value];
      }
    });

    return parse(schema, result);
  });
}

/**
 * @returns A transformer applying `JSON.parse` to the input.
 */
export function transformJsonToSchema(): TransformJsonToSchemaAction {
  return transform(JSON.parse);
}
