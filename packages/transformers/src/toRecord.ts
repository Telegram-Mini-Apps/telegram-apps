import { createError } from './errors/createError.js';
import { ERR_INVALID_VALUE, ERR_UNEXPECTED_VALUE } from './errors/errors.js';

/**
 * Converts value to a record.
 * @param value - value to convert.
 * @throws {CustomError} ERR_INVALID_VALUE
 * @throws {CustomError} ERR_UNEXPECTED_VALUE
 */
export function toRecord(value: unknown): Record<string, unknown> {
  let formattedValue: any = value;

  // Convert value to JSON in case, it is string. We expect value to be JSON string.
  if (typeof formattedValue === 'string') {
    try {
      formattedValue = JSON.parse(formattedValue);
    } catch (cause) {
      throw createError(ERR_INVALID_VALUE, undefined, cause);
    }
  }

  // We expect json to be a usual object.
  if (
    typeof formattedValue !== 'object'
    || !formattedValue
    || Array.isArray(formattedValue)
  ) {
    throw createError(ERR_UNEXPECTED_VALUE);
  }

  return formattedValue as Record<string, unknown>;
}
