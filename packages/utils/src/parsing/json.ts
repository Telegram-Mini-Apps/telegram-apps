import {isRecord} from '../validation';
import {isRGB, RGB} from '../colors';
import {
  NonOptionalField,
  OptionalField,
  Parser,
  Schema,
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
  rgb: string;
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
type SchemaParser<Schema extends JsonSchema> = (value: unknown) => ParserResult<Schema>;

/**
 * Creates parser which uses "typeof" function.
 * @param type - known type name.
 */
function createTypeOfParser<Type extends 'string' | 'boolean' | 'number'>(
  type: Type,
): FieldParser<KnownTypeMap[Type]> {
  return (value, field) => {
    if (typeof value !== type) {
      throw new TypeError(
        `Unable to parse field "${field}" with ` +
        `value ${JSON.stringify(value)} as ${type}.`,
      );
    }
    return value as KnownTypeMap[Type];
  };
}

/**
 * Parsers used for known types.
 */
const knownTypesParses = {
  string: createTypeOfParser('string'),
  boolean: createTypeOfParser('boolean'),
  number: createTypeOfParser('number'),
  rgb: (value: unknown, field: string): RGB => {
    const str = knownTypesParses.string(value, field);

    if (!isRGB(str)) {
      throw new TypeError(
        `Unable to parse field "${field}" with ` +
        `value ${JSON.stringify(value)} as RGB.`,
      );
    }
    return str;
  },
};

/**
 * Creates new Json parser according to passed schema.
 * @param schema - object schema.
 */
export function createJsonParser<S extends JsonSchema>(schema: S): SchemaParser<S> {
  // Transform schema to array of parsers.
  const parsers = schemaToParsers<FieldParser<any>, KnownTypeName, S>(
    schema, knownTypesParses,
  );

  return value => {
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

    return parsers.reduce((acc, {parser, optional, from, to}) => {
      const value = json[from];

      if (value === undefined) {
        if (!optional) {
          throw new TypeError(`Unable to parse field "${from}". Value is empty.`);
        }
      } else {
        const parsed = parser(value, from);

        if (parsed !== undefined) {
          (acc as any)[to] = parsed;
        }
      }
      return acc;
    }, {} as ParserResult<S>);
  };
}
