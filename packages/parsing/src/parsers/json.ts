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
      try {
        formattedValue = JSON.parse(formattedValue);
      } catch (error) {
        throw new ParsingError(value, { type, error });
      }
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
  }, false, isEmpty);
}
