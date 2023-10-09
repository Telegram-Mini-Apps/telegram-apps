/**
 * Formats passed value making it a path to a global variable.
 * @param value - value to format.
 */
export function formatTmaJSPackageName(value: string): string {
  return value
    .replace(/^@tma\.js\//, 'tmajs.')
    .replace(/-[a-z]/, match => match[1].toUpperCase());
}