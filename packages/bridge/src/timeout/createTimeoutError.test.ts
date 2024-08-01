import { expect, it } from 'vitest';

import { BridgeError } from '@/errors/BridgeError.js';

import { createTimeoutError } from './createTimeoutError.js';

it('should be instance of BridgeError with type "ERR_TIMED_OUT" and message "Timeout reached: {timeout}ms"', () => {
  const err = createTimeoutError(100);
  expect(err).toBeInstanceOf(BridgeError);
  expect(err.type).toBe('ERR_TIMED_OUT');
  expect(err.message).toBe('Timeout reached: 100ms');
});
