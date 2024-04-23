import { expect, it } from 'vitest';

import { SDKError } from '@/errors/SDKError.js';

import { createTimeoutError } from './createTimeoutError.js';

it('should be instance of SDKError with type "ERROR_TIMED_OUT" and message "Timeout reached: {timeout}ms"', () => {
  const err = createTimeoutError(100);
  expect(err).toBeInstanceOf(SDKError);
  expect(err.type).toBe('ERROR_TIMED_OUT');
  expect(err.message).toBe('Timeout reached: 100ms');
});
