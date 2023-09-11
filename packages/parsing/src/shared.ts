import type { And, HasUndefined, If, IsOptional, Not, Or } from '@twa.js/util-types';

/**
 * Represents any known parser.
 */
export type AnyParser<T> = Parser<T> | { parse: Parser<T> };

/**
 * Describes function which returns true in case value should be recognized as empty.
 */
export type IsEmptyFunc = (value: unknown) => boolean;

/**
 * Describes function which returns default value.
 */
export type GetDefaultFunc<T> = () => T;

/**
 * Allowed types for "getDefault" method.
 */
export type AllowedGetDefault = GetDefaultFunc<any> | undefined;

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
