/**
 * Schema expected by parser creators.
 */
export interface Schema<T extends string | Parser<any, any>> {
  [field: string]: T | {
    type: T;
    from?: string;
    optional?: boolean;
  };
}

/**
 * Returns optional fields in schema.
 */
export type OptionalField<S extends Schema<any>> = {
  [F in keyof S]: S[F] extends { optional: true } ? F : never;
}[keyof S];

/**
 * Returns non-optional fields in schema.
 */
export type NonOptionalField<S extends Schema<any>> = Exclude<keyof S, OptionalField<S>>;

/**
 * Standard parser definition.
 */
export type Parser<V, R> = (value: V) => R;

export interface SchemaFieldParser<P> {
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
export function schemaToParsers<P extends Parser<any, any>,
  T extends string,
  S extends Schema<T | P>>(
  schema: S,
  knownTypesParses: Record<T, P>,
): SchemaFieldParser<P>[] {
  return Object.entries(schema).map<SchemaFieldParser<P>>(([to, def]) => {
    if (typeof def === 'function' || typeof def === 'string') {
      return {
        optional: false,
        from: to,
        to,
        parser: typeof def === 'function' ? def : knownTypesParses[def],
      };
    }
    const { optional = false, from = to, type } = def;

    return {
      optional,
      from,
      to,
      parser: typeof type === 'function' ? type : knownTypesParses[type],
    };
  });
}
