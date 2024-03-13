/**
 * Function which returns true in case, specified method is supported.
 */
export type SupportsFunc<M extends string> = (method: M) => boolean;
