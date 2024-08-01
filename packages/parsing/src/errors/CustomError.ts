import type { ErrorType } from './errors.js';

/**
 * Error used across the SDK.
 */
export class CustomError extends Error {
  constructor(public readonly type: ErrorType, message?: string, cause?: unknown) {
    super(message, { cause });
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
