import {
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  parse,
  transform,
  type TransformAction,
} from 'valibot';

export type TransformQueryUsingAction<Schema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>
  = TransformAction<string | URLSearchParams, InferOutput<Schema>>

export function transformQueryUsing<Schema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: Schema,
): TransformQueryUsingAction<Schema> {
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