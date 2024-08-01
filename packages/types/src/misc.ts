/**
 * Function accepting the list of passed arguments and returning nothing.
 */
export type Fn<Args extends any[], R> = (...args: Args) => R;

/**
 * Function accepting the list of passed arguments and returning nothing.
 */
export type VoidFn<Args extends any[] = []> = Fn<Args, void>;