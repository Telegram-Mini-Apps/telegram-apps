/**
 * Ensures that specified value contains specified prefix.
 * @param value - value to check.
 * @param prefix - require prefix.
 */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}
