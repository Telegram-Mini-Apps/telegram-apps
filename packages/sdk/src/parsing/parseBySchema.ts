import { ParseError } from './ParseError.js';
import { ParseSchemaFieldError } from './ParseSchemaFieldError.js';
import type { Parser, Schema } from './types.js';

/**
 * Parses external value by specified schema. Functions iterates over each schema field
 * and uses getField function to get its value from the external source.
 * @param schema - object schema.
 * @param getField - function which gets external value by its field name.
 */
export function parseBySchema<T>(
  schema: Schema<T>,
  getField: (field: string) => unknown,
): T {
  const result = {} as T;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const field in schema) {
    const definition = schema[field];
    if (!definition) {
      continue;
    }

    let from: string;
    let parser: Parser<any>;

    // In case, definition has "type" property, then SchemaFieldDetailed was passed.
    if (typeof definition === 'function' || 'parse' in definition) {
      // Otherwise we are working with either parser function or instance.
      from = field;
      parser = typeof definition === 'function' ? definition : definition.parse.bind(definition);
    } else {
      const { type } = definition;

      from = definition.from || field;
      parser = typeof type === 'function' ? type : type.parse.bind(type);
    }

    let parsedValue: unknown;
    const originalValue = getField(from);

    try {
      parsedValue = parser(originalValue);
    } catch (error) {
      // If error is not instance of ParseError, we have nothing additional to do with the error.
      if (!(error instanceof ParseError)) {
        throw new ParseSchemaFieldError(from, { cause: error });
      }

      // Otherwise, we are going to rethrow the error with extended data.
      throw new ParseSchemaFieldError(from, {
        type: error.type,
        cause: error,
      });
    }

    if (parsedValue === undefined) {
      continue;
    }

    (result as any)[field] = parsedValue;
  }

  return result;
}
