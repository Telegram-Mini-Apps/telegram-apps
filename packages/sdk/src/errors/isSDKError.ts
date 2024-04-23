import { SDKError } from './SDKError.js';

/**
 * @returns True, if passed value is an instance of SDKError.
 * @param value - value to check.
 */
export function isSDKError(value: unknown): value is SDKError {
  return value instanceof SDKError;
}
