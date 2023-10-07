import { ParsingError } from '../ParsingError.js';
import { ValueParser } from '../ValueParser.js';
import { isUndefined } from '../isUndefined.js';
import type { IsEmptyFunc, Parser, Schema } from '../types.js';

export interface CreateValueParserGenOptions {
  /**
   * Should return true if passed value is recognized empty for this parser.
   * @default Function which returns true if value is undefined or null.
   */
  isEmpty?: IsEmptyFunc;
}

export type ValueParserGenOptions = CreateValueParserGenOptions;

export function unknownTypeError() {
  return new TypeError('Does not have any of expected types');
}

/**
 * Creates function which generates new scalar value parser based on the specified one.
 * @param parser - parser to use as basic.
 * @param genIsEmpty - isEmpty function for parser.
 */
export function createValueParserGen<T>(
  parser: Parser<T>,
  { isEmpty: genIsEmpty = isUndefined }: CreateValueParserGenOptions = {},
) {
  return function scalarParserGen({ isEmpty = genIsEmpty }: ValueParserGenOptions = {}) {
    return new ValueParser(parser, false, isEmpty);
  };
}

/**
 * Parses external value by specified schema. Functions iterates over each schema field
 * and uses getField function to get its value from the external source.
 * @param schema - object schema.
 * @param getField - function which gets external value by its field name.
 * @param schemaType - schema type name.
 */
export function parseBySchema<T>(
  schema: Schema<T>,
  getField: (field: string) => unknown,
  schemaType?: string,
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
    if ('type' in definition) {
      const { type } = definition;

      from = definition.from || field;
      parser = typeof type === 'function' ? type : type.parse.bind(type);
    } else {
      // Otherwise we are working with either parser function or instance.
      from = field;
      parser = typeof definition === 'function' ? definition : definition.parse.bind(definition);
    }

    let parsedValue: unknown;
    const originalValue = getField(from);

    try {
      parsedValue = parser(originalValue);
    } catch (error) {
      throw new ParsingError(originalValue, {
        field: from,
        type: schemaType,
        error,
      });
    }

    if (parsedValue === undefined) {
      continue;
    }

    (result as any)[field] = parsedValue;
  }

  return result;
}
