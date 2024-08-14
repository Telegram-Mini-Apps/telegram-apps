/**
 * Represents a classic "if" condition.
 */
export type If<Cond extends boolean, True, False> = Cond extends true ? True : False;
