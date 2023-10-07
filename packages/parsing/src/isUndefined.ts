/**
 * Returns true if passed value is undefined.
 * @param value - value to check.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
