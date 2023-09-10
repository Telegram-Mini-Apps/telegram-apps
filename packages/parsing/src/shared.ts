import type { And, HasUndefined, If, IsOptional, Not, Or } from '@twa.js/util-types';

import type { ValueParser } from './ValueParser.js';

/**
 * Represents any known parser.
 */
type AnyParser<T> = ValueParser<T> | Parser<T>;

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

export interface SchemaFieldDetailedRequired<T> extends SchemaFieldDetailed<T> {
  /**
   * Marks this property as required not removing it from the result in case, its value
   * is undefined.
   */
  required: true;
}

/**
 * Represents definition of schema field.
 */
export type SchemaField<T, Optional extends boolean> =
  | If<
  Or<Optional, Not<HasUndefined<T>>>,
  // In case, property is either optional or does not have undefined value
  // we allow passing parser directly. In case, parser returned undefined value,
  // it will be just cut out from the result.
  AnyParser<T>,
  never
>
  | If<
  And<Not<Optional>, HasUndefined<T>>,
  // In case value is not optional but can have undefined value we restrict the developer
  // by specifying some strict schema field detailed type.
  SchemaFieldDetailedRequired<T>,
  // Otherwise developer is free to specify basic schema field information.
  SchemaFieldDetailed<T>
>;

/**
 * Function which parses incoming value.
 */
export type Parser<T> = (value: unknown) => T;

/**
 * Object schema definition.
 */
export type Schema<T> = {
  [K in keyof T]: SchemaField<T[K], IsOptional<T, K>>;
};
