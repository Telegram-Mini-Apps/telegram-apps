import { TypedError, type TypedErrorOptions } from '@/errors/TypedError.js';

export function createTypedError<T extends string>(name: string): typeof TypedError<T> {
  return class Err extends TypedError<T> {
    constructor(type: T, options?: TypedErrorOptions);
    constructor(type: T, message?: string, cause?: unknown);
    constructor(public readonly type: T, messageOrOptions?: string | TypedErrorOptions, cause?: unknown) {
      super(type, messageOrOptions as any, cause);
      Object.setPrototypeOf(this, Err.prototype);
      this.name = name;
    }
  };
}