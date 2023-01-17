/**
 * Schema expected by parser creators.
 */
interface Schema<T extends string | Parser<any, any>> {
  [field: string]: T | {
    type: T;
    from?: string;
    optional?: boolean;
  };
}

/**
 * Returns optional fields in schema.
 */
type OptionalField<S extends Schema<any>> = {
  [F in keyof S]: S[F] extends { optional: true } ? F : never;
}[keyof S];

/**
 * Returns non-optional fields in schema.
 */
type NonOptionalField<S extends Schema<any>> = Exclude<keyof S, OptionalField<S>>;

/**
 * Standard parser definition.
 */
type Parser<V, R> = (value: V, field: string) => R;

interface SchemaFieldParser<P> {
  from: string;
  to: string;
  optional: boolean;
  parser: P;
}

/**
 * Converts schema to array of parsers.
 * @param schema - schema definition.
 * @param knownTypesParses - list of known types and their parsers.
 */
function schemaToParsers<P extends Parser<any, any>,
  T extends string,
  S extends Schema<T | P>>(
  schema: S,
  knownTypesParses: Record<T, P>
): SchemaFieldParser<P>[] {
  return Object.entries(schema).map<SchemaFieldParser<P>>(([to, def]) => {
    let optional: boolean;
    let from: string;
    let parser: P;

    if (typeof def === 'function' || typeof def === 'string') {
      optional = false;
      from = to;
      parser = typeof def === 'function' ? def : knownTypesParses[def];
    } else {
      const {optional: _optional = false, from: _from = to, type} = def;
      optional = _optional;
      from = _from;
      parser = typeof type === 'function' ? type : knownTypesParses[type];
    }
    return {optional, from, to, parser};
  })
}

export {Schema, OptionalField, NonOptionalField, Parser, schemaToParsers};