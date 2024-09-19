import { TypedError } from '@telegram-apps/toolkit';

import { ERR_PARSE } from './errors/errors.js';
import type { TransformFn, Schema } from './types.js';

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

  for (const field in schema) {
    const definition = schema[field];
    if (!definition) {
      continue;
    }

    let from: string;
    let transform: TransformFn<any>;

    if (typeof definition === 'function') {
      from = field;
      transform = definition;
    } else {
      [from, transform] = definition;
    }

    try {
      const parsedValue = transform(getField(from));
      if (parsedValue !== undefined) {
        (result as any)[field] = parsedValue;
      }
    } catch (cause) {
      throw new TypedError(
        ERR_PARSE,
        `Parser for "${field}" property failed${from === field ? '' : `. Source field: "${from}"`}`,
        cause
      );
    }
  }

  return result;
}
