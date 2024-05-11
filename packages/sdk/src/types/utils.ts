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

/**
 * Marks specified properties as optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Marks specified properties as required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Appends `null` and `undefined`.
 */
export type Maybe<T> = T | null | undefined;
