/**
 * Represents a function which is recognized as parser. It receives value
 * which is presented in some URL search params.
 */
export type SearchParamsParser<R> = (value: string | null) => R;

/**
 * Represents parsing schema definition for some URLSearchParams. Value
 * describes settings for property. The first value is source search parameter
 * name and the second one is parser which accepts specified parameter value.
 */
export type SearchParamsStructSchema<T> = {
  [K in keyof T]-?: [string, SearchParamsParser<T[K]>];
};
