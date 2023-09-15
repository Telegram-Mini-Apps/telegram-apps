import { toRGB, type RGB } from '@twa.js/colors';

import { ValueParser } from './ValueParser.js';
import { ArrayValueParser } from './ArrayValueParser.js';

import type { Parser, Schema } from './shared.js';

/**
 * Information about types, known by JSON parser. Key is type name and value
 * is corresponding parser expected result type.
 */
interface KnownTypeMap {
  boolean: boolean;
  number: number;
  string: string;
}

/**
 * Creates parser generator from specified parser.
 * @param parser - value parser.
 */
export function createParserGenerator<T>(parser: Parser<T>) {
  return () => ValueParser.create(parser);
}

/**
 * Creates parser generator which uses "typeof" function.
 * @param type - known type name.
 */
function createTypeOfParserGenerator<Type extends keyof KnownTypeMap>(type: Type) {
  return createParserGenerator((value) => {
    if (typeof value !== type) {
      throw new TypeError(`Unable to parse value ${JSON.stringify(value)} as ${type}.`);
    }
    return value as KnownTypeMap[Type];
  });
}

/**
 * Parses external value by specified schema. Functions iterates over each schema field
 * and uses getField function to get its value from the external source.
 * @param schema - object schema.
 * @param getField - function which gets external value by its field name.
 */
function parseBySchema<T>(schema: Schema<T>, getField: (field: string) => unknown): T {
  const result = {} as T;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const field in schema) {
    const definition = schema[field];

    if (!definition) {
      continue;
    }

    let from: string;
    let parser: Parser<any>;
    let required: boolean;

    // In case, definition has "type" property, then SchemaFieldDetailed was passed.
    if ('type' in definition) {
      const { from: defFrom = field, type } = definition;

      from = defFrom;
      parser = typeof type === 'function' ? type : type.parse.bind(type);
      required = 'required' in definition ? definition.required : false;
    } else {
      // Otherwise we are working with either parser function or instance.
      from = field;
      required = false;
      parser = typeof definition === 'function' ? definition : definition.parse.bind(definition);
    }

    let parsedValue: unknown;

    try {
      parsedValue = parser(getField(from));
    } catch (cause) {
      throw new Error(`Unable to parse field "${from}"`, { cause });
    }

    if (parsedValue === undefined && !required) {
      continue;
    }

    (result as any)[field] = parsedValue;
  }

  return result;
}

/**
 * Generates parser which parses Json value as string.
 */
export const string = createTypeOfParserGenerator('string');

/**
 * Generates parser which parses Json value as number.
 */
export const number = createTypeOfParserGenerator('number');

/**
 * Generates parser which parses Json value as boolean.
 */
export const boolean = createTypeOfParserGenerator('boolean');

/**
 * Parses incoming value as Date.
 */
export const date = createParserGenerator<Date>((value) => {
  const asStr = string().parse(value);

  if (asStr) {
    const asInt = Number(asStr);
    const dateValue = new Date(asInt.toString() === asStr ? asInt * 1000 : asStr);

    if (dateValue.toString() !== 'Invalid Date') {
      return dateValue;
    }
  }

  throw new TypeError(`Unable to parse value "${value}" as Date.`);
});

/**
 * Parses incoming value as RGB color.
 */
export const rgb = createParserGenerator<RGB>((value) => {
  const asStr = string().parse(value);

  try {
    return toRGB(asStr);
  } catch (cause) {
    throw new TypeError(`Unable to parse value "${asStr}" as RGB.`, { cause });
  }
});

/**
 * Creates new Json parser according to passed schema.
 * @param schema - object schema.
 */
export function json<T>(schema: Schema<T>): ValueParser<T, false, undefined> {
  return ValueParser.create((value) => {
    let formattedValue: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof formattedValue === 'string') {
      try {
        formattedValue = JSON.parse(formattedValue);
      } catch (e) {
        throw new TypeError('Value is not JSON object converted to string.');
      }
    }

    // We expect json to be usual object.
    if (
      typeof formattedValue !== 'object'
      || formattedValue === null
      || Array.isArray(formattedValue)
    ) {
      throw new TypeError('Value is not JSON object.');
    }

    return parseBySchema(schema, (field) => formattedValue[field]);
  });
}

/**
 * Creates new search params parser according to passed schema.
 * @param schema - object schema.
 */
export function searchParams<T>(schema: Schema<T>): ValueParser<T, false, undefined> {
  return ValueParser.create((value) => {
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw new TypeError('Value has not processable type.');
    }

    const params = typeof value === 'string' ? new URLSearchParams(value) : value;

    return parseBySchema(schema, (field) => {
      const paramsValue = params.get(field);

      // In case we met null value, we should return undefined to let other parsers know
      // this field is missing.
      return paramsValue === null ? undefined : paramsValue;
    });
  });
}

/**
 * Parses incoming value as an array.
 */
export function array() {
  return new ArrayValueParser((value) => value, false, undefined);
}
