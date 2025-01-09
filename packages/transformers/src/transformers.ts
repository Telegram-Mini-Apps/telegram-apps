import {
  type BaseIssue,
  type  BaseSchema,
  instance,
  parse,
  string,
  transform,
  union,
} from 'valibot';
import { snakeToCamelObjKeys } from '@telegram-apps/toolkit';

/**
 * Returns a transformer parsing the input as JSON.
 */
export function jsonParse() {
  return transform((input: string) => JSON.parse(input));
}

/**
 * Returns a validator waiting for the input to be a string or an instance of URLSearchParams.
 */
export function query() {
  return union([string(), instance(URLSearchParams)]);
}

/**
 * Returns a transformer converting the input presented as a string or an instance of
 * URLSearchParams to Record<string, string | string[]>.
 */
export function queryToRecord() {
  return transform((input: string | URLSearchParams) => {
    const result: Record<string, string | string[]> = {};

    new URLSearchParams(input).forEach((value, key) => {
      const accValue = result[key];
      if (accValue === undefined || !Array.isArray(accValue)) {
        result[key] = value;
      } else {
        accValue.push(value);
      }
    });

    return result;
  });
}

/**
 * Returns a transformer converting the input object keys from snake to camel case.
 */
export function snakeToCamelKeys<T extends object>() {
  return transform(snakeToCamelObjKeys<T>);
}

/**
 * Returns a transformer using the passed schema to parse the input.
 * @param schema - schema to use to parse the input.
 */
export function transformUsing<Input, Schema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: Schema,
) {
  return transform((input: Input) => parse(schema, input));
}