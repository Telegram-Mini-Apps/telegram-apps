import { createTypeError } from './createTypeError.js';

/**
 * Converts value to record.
 * @param value - value to convert.
 * @throws {Error} Value passed as a string does not represent JSON object.
 * @throws {Error} Value is not convertable.
 */
export function toRecord(value: unknown): Record<string, unknown> {
  let formattedValue: any = value;

  // Convert value to JSON in case, it is string. We expect value to be JSON string.
  if (typeof formattedValue === 'string') {
    formattedValue = JSON.parse(formattedValue);
  }

  // We expect json to be usual object.
  if (
    typeof formattedValue !== 'object'
    || formattedValue === null
    || Array.isArray(formattedValue)
  ) {
    throw createTypeError();
  }

  return formattedValue;
}
