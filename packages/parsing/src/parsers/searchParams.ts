import { ParsingError } from '../ParsingError.js';
import { parseBySchema, unknownTypeError } from './shared.js';
import { ValueParser } from '../ValueParser.js';
import type { Schema, IsEmptyFunc } from '../types.js';
import { isUndefined } from '../isUndefined.js';

interface Options {
  /**
   * Described type name.
   */
  type?: string;

  /**
   * Should return true if passed value is recognized empty for this parser.
   * @default Function which returns true if value is undefined or null.
   */
  isEmpty?: IsEmptyFunc;
}

/**
 * Creates new search params parser according to passed schema.
 * @param schema - object schema.
 * @param options - additional options.
 */
export function searchParams<T>(schema: Schema<T>, options: Options = {}): ValueParser<T, false> {
  const {
    type,
    isEmpty = isUndefined,
  } = options;

  return new ValueParser((value) => {
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw new ParsingError(value, { type, error: unknownTypeError() });
    }

    const params = typeof value === 'string' ? new URLSearchParams(value) : value;

    return parseBySchema(schema, (field) => {
      const paramValue = params.get(field);
      return paramValue === null ? undefined : paramValue;
    });
  }, false, isEmpty);
}
