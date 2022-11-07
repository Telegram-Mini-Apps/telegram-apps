/**
 * Represents a function which is recognized as parser for some JSON value.
 * It receives value which is presented in some JSON.
 */
export type JsonParser<R> = (value: unknown) => R;

/**
 * Represents parsing schema definition for some JSON structure. Value
 * describes settings for this JSON property. The first value is source
 * JSON property name and the second one is parser which accepts specified
 * property value.
 */
export type JsonStructSchema<T> = {
  [K in keyof T]-?: [string, JsonParser<T[K]>];
};