/**
 * Returns true in case, T is never.
 */
export type IsNever<T> = [T] extends [never] ? true : false;
