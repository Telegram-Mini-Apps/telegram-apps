/**
 * Represents classic "if" condition.
 */
export type If<Cond extends boolean, True, False> = Cond extends true ? True : False;

/**
 * Represents classic "not" logical operation.
 */
export type Not<Cond extends boolean> = If<Cond, false, true>;

/**
 * Represents classic "and" logical operation.
 */
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/**
 * Represents classic "or" logical operation.
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : (B extends true ? true : false);
