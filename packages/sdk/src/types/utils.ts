/**
 * Returns true in case, T is never.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Represents classic "if" condition.
 */
export type If<Cond extends boolean, True, False> = Cond extends true ? True : False;

/**
 * Represents classic "not" bitwise operation.
 */
export type Not<Cond extends boolean> = If<Cond, false, true>;

/**
 * Represents classic "and" bitwise operation.
 */
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/**
 * Represents classic "or" bitwise operation.
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : (B extends true ? true : false);

/**
 * True if value includes undefined.
 */
export type HasUndefined<T> = undefined extends T ? true : false;

/**
 * Returns true if specified property in type is marked as optional.
 */
export type IsOptional<Type, Key extends keyof Type> = {} extends Pick<Type, Key> ? true : false;

/**
 * Returns union object keys.
 */
export type UnionKeys<T> = T extends T ? keyof T : never;

/**
 * Returns object string keys.
 */
export type StringKeys<T extends object> = Extract<keyof T, string>;
