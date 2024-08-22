import { ERR_INVALID_VALUE, ERR_UNEXPECTED_VALUE } from '@/errors/errors.js';
import { TransformerError } from '@/errors/TransformerError.js';

/**
 * Converts value to a record.
 * @param value - value to convert.
 * @throws {TransformerError} ERR_INVALID_VALUE
 * @throws {TransformerError} ERR_UNEXPECTED_VALUE
 */
export function toRecord(value: unknown): Record<string, unknown> {
  let formattedValue: any = value;

  // Convert value to JSON in case, it is string. We expect value to be JSON string.
  if (typeof formattedValue === 'string') {
    try {
      formattedValue = JSON.parse(formattedValue);
    } catch (cause) {
      throw new TransformerError(ERR_INVALID_VALUE, { cause });
    }
  }

  // We expect json to be a usual object.
  if (
    typeof formattedValue !== 'object'
    || !formattedValue
    || Array.isArray(formattedValue)
  ) {
    throw new TransformerError(ERR_UNEXPECTED_VALUE);
  }

  return formattedValue as Record<string, unknown>;
}
