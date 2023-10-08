/**
 * Replaces "@tma.js/" with "tmajs.". We usually do this to make better experience
 * during UMD format package usage.
 * @param value
 */
export function formatTmaJSPackageName(value: string): string {
  return value.replace(/^@tma\.js\//, 'tmajs.');
}