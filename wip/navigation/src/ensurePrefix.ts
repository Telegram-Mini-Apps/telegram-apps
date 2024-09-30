/**
 * Ensures that the specified value starts with the specified prefix. If it doesn't, function
 * appends it.
 * @param value - value to check.
 * @param prefix - prefix to add.
 * @returns Value with the prefix.
 */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}
