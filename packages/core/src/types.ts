/**
 * Returns keys which are optional or could have undefined values in specified
 * type.
 */
export type UndefKeys<T> = Exclude<{
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T], undefined>;

/**
 * Represents function with any arguments list and result.
 */
export type AnyFunc = (...args: any[]) => any;

/**
 * Returns true in case, T is never.
 */
export type IsNever<T> = [T] extends [never] ? true : false;
