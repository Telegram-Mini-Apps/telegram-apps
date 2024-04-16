import { createError } from '@/errors/createError.js';
import { ERROR_PARSE } from '@/errors/errors.js';

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
      const { type: definitionType } = definition;

      from = definition.from || field;
      parser = typeof definitionType === 'function'
        ? definitionType
        : definitionType.parse.bind(definitionType);
    }

    try {
      const parsedValue = parser(getField(from));
      if (parsedValue !== undefined) {
        (result as any)[field] = parsedValue;
      }
    } catch (error) {
      throw createError(ERROR_PARSE, `Unable to parse field "${field}"`, error);
    }
  }

  return result;
}
