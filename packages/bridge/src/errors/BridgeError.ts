import type { ErrorType } from './errors.js';

/**
 * Error used across the SDK.
 */
export class BridgeError extends Error {
  constructor(public readonly type: ErrorType, message?: string, cause?: unknown) {
    super(message, { cause });
    Object.setPrototypeOf(this, BridgeError.prototype);
  }
}
