export type TransformFn<T> = (value: unknown) => T;

export interface TransformerGen<T> {
  /**
   * @param optional - is result optional.
   * @returns A function, which transforms the value to the type T. If optional is `true` or omitted,
   * it skips parsing the `undefined` value and returns it.
   */
  (optional: true): TransformFn<T | undefined>;
  /**
   * @param optional - is result optional.
   * @returns A function, which transforms the value to the type T. If optional is `true` or omitted,
   * it skips parsing the `undefined` value and returns it.
   */
  (optional?: boolean): TransformFn<T>;
}

/**
 * Object schema definition.
 */
export type Schema<T> = {
  [K in keyof T]: TransformFn<T[K]> | [
  /**
   * Source property name.
   */
  from: string,
  /**
   * Value transformer.
   */
  transform: TransformFn<T[K]>,
];
};
