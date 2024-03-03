/**
 * Marks specified properties as optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Marks specified properties as required.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type FlattenAccessors<T> = {
  [K in keyof T]: T[K] extends () => infer U ? U : T[K]
};
