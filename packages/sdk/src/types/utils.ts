/**
 * Returns true in case, T is never.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Returns true in case, T is undefined.
 */
export type IsUndefined<T> = [T] extends [undefined] ? true : false;

/**
 * Returns object string keys.
 */
export type StringKeys<T extends object> = Extract<keyof T, string>;
