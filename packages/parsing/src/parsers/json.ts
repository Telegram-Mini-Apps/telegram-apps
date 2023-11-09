import { ValueParser } from '../ValueParser.js';
import { isUndefined } from '../isUndefined.js';
import { unexpectedTypeError } from '../unexpectedTypeError.js';
import { parseBySchema } from '../parseBySchema.js';
import type { Schema, IsEmptyFunc } from '../types.js';

interface Options {
  /**
   * Type name.
   */
  type?: string;

  /**
   * Should return true if passed value is recognized empty for this parser.
   * @default Function which returns true if value is undefined or null.
   */
  isEmpty?: IsEmptyFunc;
}

/**
 * Creates new Json parser according to passed schema.
 * @param schema - object schema.
 * @param options - additional options.
 */
export function json<T>(schema: Schema<T>, options: Options = {}): ValueParser<T, false> {
  const {
    type,
    isEmpty = isUndefined,
  } = options;

  return new ValueParser((value) => {
    let formattedValue: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof formattedValue === 'string') {
      formattedValue = JSON.parse(formattedValue);
    }

    // We expect json to be usual object.
    if (
      typeof formattedValue !== 'object'
      || formattedValue === null
      || Array.isArray(formattedValue)
    ) {
      throw unexpectedTypeError();
    }

    return parseBySchema(schema, (field) => formattedValue[field]);
  }, false, isEmpty, type);
}
