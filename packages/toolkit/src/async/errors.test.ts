import { describe, expect, it } from 'vitest';
import { TypedError } from '@/errors/TypedError.js';

import {
  createAbortError,
  isAbortError,
  isCanceledError,
  isTimeoutError,
} from './errors.js';

describe('createAbortError', () => {
  it('should create TypedError with type ERR_ABORTED', () => {
    expect(createAbortError({ cause: new Error('TEST') })).toStrictEqual(
      new TypedError('ERR_ABORTED', { cause: new Error('TEST') }),
    );
  });
});

describe('isTimeoutError', () => {
  it('should return true if value is instance of TypedError and type is ERR_TIMED_OUT', () => {
    expect(isTimeoutError({ type: 'ERR_TIMED_OUT' })).toBe(false);
    expect(isTimeoutError(new TypedError('ERR_TIMED_OUT'))).toBe(true);
  });
});

describe('isAbortError', () => {
  it('should return true if value is instance of TypedError and type is ERR_ABORTED', () => {
    expect(isAbortError({ type: 'ERR_ABORTED' })).toBe(false);
    expect(isAbortError(new TypedError('ERR_ABORTED'))).toBe(true);
  });
});

describe('isCancelledError', () => {
  it('should return true if value is instance of TypedError and type is ERR_CANCELED', () => {
    expect(isCanceledError({ type: 'ERR_CANCELED' })).toBe(false);
    expect(isCanceledError(new TypedError('ERR_CANCELED'))).toBe(true);
  });
});
