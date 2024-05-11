/**
 * Function which returns true in case, specified method is supported.
 */
export type SupportsFn<M extends string> = (method: M) => boolean;
