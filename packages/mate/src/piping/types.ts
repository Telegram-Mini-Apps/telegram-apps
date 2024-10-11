export type CommandOptions<T, Mixin = {}> = Mixin & {
  args: T;
};

export type OmitMerge<A, B> = Omit<A, keyof B> & B;