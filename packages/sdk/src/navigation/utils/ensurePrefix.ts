/**
 * Ensures, that specified value starts with the specified prefix. If it doesn't, function appends
 * prefix.
 * @param value - value to check.
 * @param prefix - prefix to add.
 */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}
