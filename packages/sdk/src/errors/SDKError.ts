import type { ErrorType } from './errors.js';

/**
 * Error used across the SDK.
 */
export class SDKError extends Error {
  constructor(public readonly type: ErrorType, message?: string, cause?: unknown) {
    super(message, { cause });
    Object.setPrototypeOf(this, SDKError.prototype);
  }
}
