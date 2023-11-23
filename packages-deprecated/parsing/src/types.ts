/**
 * Represents any known parser.
 */
export type AnyParser<T> = Parser<T> | { parse: Parser<T> };

/**
 * Detailed schema field options.
 */
export interface SchemaFieldDetailed<T> {
  /**
   * Source property name.
   * @default Original property name in schema.
   */
  from?: string;

  /**
   * Function which should parse incoming value and return expected type.
   */
  type: AnyParser<T>;
}

/**
 * Function which parses incoming value.
 */
export type Parser<T> = (value: unknown) => T;

/**
 * Object schema definition.
 */
export type Schema<T> = {
  [K in keyof T]: AnyParser<T[K]> | SchemaFieldDetailed<T[K]>;
};
