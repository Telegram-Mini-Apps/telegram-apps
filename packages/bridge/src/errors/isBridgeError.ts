import { BridgeError } from '@/errors/BridgeError.js';

/**
 * @returns True, if passed value is an instance of BridgeError.
 * @param value - value to check.
 */
export function isBridgeError(value: unknown): value is BridgeError {
  return value instanceof BridgeError;
}
