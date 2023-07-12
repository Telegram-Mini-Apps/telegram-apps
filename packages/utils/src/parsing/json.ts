import { isRecord } from '../validation';
import { isRGB, RGB } from '../colors';
import {
  type NonOptionalField,
  type OptionalField,
  type Parser,
  type Schema,
  schemaToParsers,
} from './shared';

/**
 * Information about types, known by JSON parser. Key is type name and value
 * is corresponding parser expected result type.
 */
interface KnownTypeMap {
  string: string;
  boolean: boolean;
  number: number;
  rgb: RGB;
}

/**
 * Parser known type name.
 */
type KnownTypeName = keyof KnownTypeMap;

/**
 * Standard parser definition.
 */
type FieldParser<R> = Parser<unknown, R>;

/**
 * Json schema definition.
 */
type JsonSchema = Schema<KnownTypeName | FieldParser<any>>;

/**
 * Calculates schema parser result type.
 */
type ComputeSchemaValue<Definition> = Definition extends { type: KnownTypeName }
  ? KnownTypeMap[Definition['type']]
  : Definition extends { type: FieldParser<infer R> } ? R : never;

/**
 * Result of Json parser perform.
 */
type ParserResult<S extends JsonSchema> = {
  [F in NonOptionalField<S>]: ComputeSchemaValue<S[F]>;
} & {
  [F in OptionalField<S>]?: ComputeSchemaValue<S[F]>;
};

/**
 * Schema parser definition.
 */
type SchemaParser<S extends JsonSchema> = (value: unknown) => ParserResult<S>;

/**
 * Creates parser which uses "typeof" function.
 * @param type - known type name.
 */
function createTypeOfParser<Type extends 'string' | 'boolean' | 'number'>(
  type: Type,
): FieldParser<KnownTypeMap[Type]> {
  return (value) => {
    if (typeof value !== type) {
      throw new TypeError(
        `Unable to parse value ${JSON.stringify(value)} as ${type}.`,
      );
    }
    return value as KnownTypeMap[Type];
  };
}

/**
 * Parses Json value as string.
 */
export const parseJsonValueAsString = createTypeOfParser('string');

/**
 * Parses Json value as boolean.
 */
export const parseJsonValueAsBoolean = createTypeOfParser('boolean');

/**
 * Parses Json value as number.
 */
export const parseJsonValueAsNumber = createTypeOfParser('number');

/**
 * Parses Json value as RGB color.
 */
export function parseJsonValueAsRgb(value: unknown): RGB {
  const str = parseJsonValueAsString(value);

  if (!isRGB(str)) {
    throw new TypeError(`Unable to parse value "${str}" as RGB.`);
  }
  return str;
}

/**
 * Parsers used for known types.
 */
const knownTypesParses = {
  string: parseJsonValueAsString,
  boolean: parseJsonValueAsBoolean,
  number: parseJsonValueAsNumber,
  rgb: parseJsonValueAsRgb,
};

/**
 * Creates new Json parser according to passed schema.
 * @param schema - object schema.
 */
export function createJsonParser<S extends JsonSchema>(schema: S): SchemaParser<S> {
  // Transform schema to array of parsers.
  const parsers = schemaToParsers<FieldParser<any>, KnownTypeName, S>(schema, knownTypesParses);

  return (value) => {
    let json: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        throw new TypeError('Value is not JSON object converted to string.');
      }
    }

    // We expect json to be usual object.
    if (!isRecord(json)) {
      throw new TypeError('Value is not JSON object.');
    }

    return parsers.reduce((acc, {
      parser, optional, from, to,
    }) => {
      const jsonValue = json[from];

      if (jsonValue === undefined) {
        if (!optional) {
          throw new Error(`Unable to parse field "${from}". Value is empty.`);
        }
        return acc;
      }
      try {
        const parsed = parser(jsonValue);

        if (parsed !== undefined) {
          (acc as any)[to] = parsed;
        }
      } catch (cause) {
        throw new Error(`Unable to parse field "${from}"`, { cause });
      }
      return acc;
    }, {} as ParserResult<S>);
  };
}
