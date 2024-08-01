/**
 * Returns union object keys.
 */
export type UnionKeys<T> = T extends T ? keyof T : never;
