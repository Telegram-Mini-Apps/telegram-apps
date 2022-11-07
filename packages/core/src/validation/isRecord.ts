/**
 * States that passed value is Record and not Array.
 * @param value - value to check.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}