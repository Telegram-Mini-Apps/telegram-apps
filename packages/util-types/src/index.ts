export type IsNever<T> = [T] extends [never] ? true : false;

export type If<Cond extends boolean, True, False> = Cond extends true ? True : False;

export type VoidFn<Args extends any[] = []> = (...args: Args) => void;