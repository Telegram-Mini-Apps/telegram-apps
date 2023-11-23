import { ValueParser } from '../ValueParser.js';
import { unexpectedTypeError } from '../unexpectedTypeError.js';
import { parseBySchema } from '../parseBySchema.js';
import type { Schema } from '../types.js';

/**
 * Creates new search params parser according to passed schema.
 * @param schema - object schema.
 * @param type - parser type name.
 */
export function searchParams<T>(schema: Schema<T>, type?: string): ValueParser<T, false> {
  return new ValueParser((value) => {
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw unexpectedTypeError();
    }

    const params = typeof value === 'string' ? new URLSearchParams(value) : value;

    return parseBySchema(schema, (field) => {
      const paramValue = params.get(field);
      return paramValue === null ? undefined : paramValue;
    });
  }, false, type);
}
