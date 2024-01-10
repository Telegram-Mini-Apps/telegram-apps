import { expect, it } from 'vitest';

import { isTimeoutError } from '../isTimeoutError';
import { TimeoutError } from '../TimeoutError';

it('should return true if passed value is instance of TimeoutError', () => {
  expect(isTimeoutError(null)).toBe(false);
  expect(isTimeoutError(new TimeoutError(1000))).toBe(true);
});
