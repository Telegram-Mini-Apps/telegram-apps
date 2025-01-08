/**
 * Converts string value from camel case to snake case.
 * @param value - value to convert.
 */
export function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}