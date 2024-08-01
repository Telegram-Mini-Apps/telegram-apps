/**
 * Represents a classic "if" condition.
 */
export type If<Cond extends boolean, True, False> = Cond extends true ? True : False;

/**
 * Represents classic "or" logical operation.
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : (B extends true ? true : false);
