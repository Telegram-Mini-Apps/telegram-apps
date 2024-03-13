/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
export function truncate(value: number): number {
  return value < 0 ? 0 : value;
}
