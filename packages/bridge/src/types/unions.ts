/**
 * Returns union keys removing those, which values are not strings.
 */
export type UnionStringKeys<U> = U extends U
  ? {
    [K in keyof U]-?: U[K] extends string | undefined ? K : never;
  }[keyof U]
  : never;

/**
 * Returns union required keys.
 */
export type UnionRequiredKeys<U> = U extends U
  ? {
    [K in UnionStringKeys<U>]: ({} extends Pick<U, K> ? never : K)
  }[UnionStringKeys<U>]
  : never;

/**
 * Returns union optional keys.
 */
export type UnionOptionalKeys<U> = Exclude<UnionStringKeys<U>, UnionRequiredKeys<U>>;

/**
 * Returns union object keys.
 */
export type UnionKeys<T> = T extends T ? keyof T : never;
