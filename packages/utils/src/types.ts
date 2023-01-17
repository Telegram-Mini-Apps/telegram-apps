/**
 * Returns true in case, T is never.
 */
type IsNever<T> = [T] extends [never] ? true : false;

export {IsNever};