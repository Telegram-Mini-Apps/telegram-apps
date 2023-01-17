import {
  NonOptionalField,
  OptionalField,
  Parser,
  Schema,
  schemaToParsers,
} from './shared';

/**
 * Information about types, known by search params parser. Key is type name
 * and value is corresponding parser expected result type.
 */
interface KnownTypeMap {
  string: string;
  date: Date;
}

/**
 * Parser known type name.
 */
type KnownTypeName = keyof KnownTypeMap;

/**
 * Standard parser definition.
 */
type FieldParser<R> = Parser<string, R>;

/**
 * Search params schema definition.
 */
type SearchParamsSchema = Schema<KnownTypeName | FieldParser<any>>;

/**
 * Calculates schema parser result type.
 */
type ComputeSchemaValue<Definition> = Definition extends { type: KnownTypeName }
  ? KnownTypeMap[Definition['type']]
  : Definition extends { type: FieldParser<infer R> } ? R : never;

/**
 * Result of search params parser perform.
 */
type ParserResult<S extends SearchParamsSchema> = {
  [F in NonOptionalField<S>]: ComputeSchemaValue<S[F]>;
} & {
  [F in OptionalField<S>]?: ComputeSchemaValue<S[F]>;
};

/**
 * Search params parser definition.
 */
type SchemaParser<Schema extends SearchParamsSchema> =
  (value: unknown) => ParserResult<Schema>;

/**
 * Parsers used for known types.
 */
const knownTypesParses = {
  string: (value: string) => value,
  date: (value: string, field: string) => {
    if (value !== '') {
      const asInt = Number(value);
      const date = new Date(asInt.toString() === value ? asInt * 1000 : value);

      if (date.toString() !== 'Invalid Date') {
        return date;
      }
    }
    throw new TypeError(
      `Unable to parse field "${field}" with ` +
      `value ${JSON.stringify(value)} as Date.`,
    );
  },
};

/**
 * Creates new search params parser according to passed schema.
 * @param schema - object schema.
 */
function createSearchParamsParser<S extends SearchParamsSchema>(
  schema: S,
): SchemaParser<S> {
  // Transform schema to array of parsers.
  const parsers = schemaToParsers<FieldParser<any>, KnownTypeName, S>(
    schema, knownTypesParses,
  );

  return value => {
    if (value === undefined) {
      throw new TypeError('Value is empty.');
    }
    if (typeof value !== 'string' && !(value instanceof URLSearchParams)) {
      throw new TypeError('Value has not processable type.');
    }
    const params = typeof value === 'string'
      ? new URLSearchParams(value)
      : value;

    return parsers.reduce((acc, {parser, to, optional, from}) => {
      const value = params.get(from);

      if (value === null) {
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

export {createSearchParamsParser};