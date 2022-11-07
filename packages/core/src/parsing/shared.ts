import {UndefKeys} from '../types';

/**
 * Result of function which represents a parser created with specified
 * schema.
 */
export type SchemaParserResult<T> =
  { [K in UndefKeys<T>]?: T[K] }
  & { [K in Exclude<keyof T, UndefKeys<T>>]: T[K] };

/**
 * Function which accepts value and converts it to specified type.
 */
export type SchemaParserResultFunc<R> = (value: unknown) => R;